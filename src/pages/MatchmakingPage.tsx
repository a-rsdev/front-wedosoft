import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Swords } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { findMatchApi, finishMatchApi, getMatchApi, getMatchRoadmapsApi, submitMatchAnswerApi } from '../api/matchesApi';
import { Match, MatchFinishResponse, MatchQuestion, MatchRoadmap } from '../types';
import { RoadmapPicker } from '../components/match/RoadmapPicker';
import { MatchSearching } from '../components/match/MatchSearching';
import { BattleArena, RoundRevealData } from '../components/match/BattleArena';
import { MatchResult } from '../components/match/MatchResult';

type Screen = 'picker' | 'searching' | 'in_game' | 'finished';

const errorCode = (error: any, fallback: string) => error?.response?.data?.error || fallback;

export const MatchmakingPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [screen, setScreen] = useState<Screen>('picker');
  const [roadmaps, setRoadmaps] = useState<MatchRoadmap[]>([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  const [roadmapsError, setRoadmapsError] = useState<string | null>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<MatchRoadmap | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [result, setResult] = useState<MatchFinishResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reveal, setReveal] = useState<RoundRevealData | null>(null);

  const matchRef = useRef<Match | null>(null);
  const questionCache = useRef(new Map<string, MatchQuestion>());
  const revealTimer = useRef<number | null>(null);
  const finishInFlight = useRef(false);
  const pollInFlight = useRef(false);
  const searchInFlight = useRef(false);

  const loadRoadmaps = useCallback(async () => {
    setRoadmapsLoading(true);
    setRoadmapsError(null);
    try {
      const availableRoadmaps = await getMatchRoadmapsApi();
      setRoadmaps(availableRoadmaps.filter((roadmap) => roadmap.completed_units >= 1));
    } catch (error: any) {
      setRoadmapsError(errorCode(error, 'Could not load battle roadmaps.'));
    } finally {
      setRoadmapsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoadmaps();
    return () => {
      if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
    };
  }, [loadRoadmaps]);

  const finishMatch = useCallback(async (matchData: Match) => {
    if (finishInFlight.current) return;
    finishInFlight.current = true;
    try {
      const finishResult = await finishMatchApi(matchData.id);
      setResult(finishResult);
      setScreen('finished');
      refreshUser();
      showToast('success', 'Match finished!', `+${finishResult.your_points_earned} PTS earned`);
    } catch (error: any) {
      finishInFlight.current = false;
      showToast('error', 'Could not finish match', errorCode(error, 'MATCH_FINISH_ERROR'));
    }
  }, [refreshUser, showToast]);

  const applyMatch = useCallback((data: Match) => {
    const previous = matchRef.current;
    if (previous?.current_question) questionCache.current.set(previous.current_question.id, previous.current_question);
    if (data.current_question) questionCache.current.set(data.current_question.id, data.current_question);

    if (previous && data.rounds.length > previous.rounds.length) {
      const latestRound = data.rounds[data.rounds.length - 1];
      const revealQuestion = questionCache.current.get(latestRound.question_id) ?? null;
      setReveal({ question: revealQuestion, round: latestRound, roundNumber: data.rounds.length });
      if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
      revealTimer.current = window.setTimeout(() => setReveal(null), 2500);
    }

    matchRef.current = data;
    setMatch(data);
    setScreen((current) => current === 'finished' ? current : 'in_game');

    if (data.current_question === null && data.rounds.length === data.total_rounds) {
      void finishMatch(data);
    }
  }, [finishMatch]);

  const pollMatch = useCallback(async (matchId: string) => {
    if (pollInFlight.current) return;
    pollInFlight.current = true;
    try {
      applyMatch(await getMatchApi(matchId));
    } catch (error: any) {
      showToast('error', 'Match sync failed', errorCode(error, 'MATCH_FETCH_ERROR'));
    } finally {
      pollInFlight.current = false;
    }
  }, [applyMatch, showToast]);

  useEffect(() => {
    if (!match?.id || screen === 'finished') return;
    const matchId = match.id;
    const poll = window.setInterval(() => void pollMatch(matchId), 1500);
    return () => window.clearInterval(poll);
  }, [match?.id, pollMatch, screen]);

  useEffect(() => {
    setSelectedOption(null);
    setSubmitting(false);
  }, [match?.current_question?.id]);

  useEffect(() => {
    if (screen !== 'searching' || !selectedRoadmap) return;
    let active = true;

    const search = async () => {
      if (searchInFlight.current) return;
      searchInFlight.current = true;
      try {
        const found = await findMatchApi(selectedRoadmap.id);
        if (!active) return;
        if (found.status === 'matched' && found.match_id) {
          showToast('info', 'Opponent found!', 'The duel is starting.');
          await pollMatch(found.match_id);
        }
      } catch (error: any) {
        if (!active) return;
        setScreen('picker');
        showToast('error', 'Matchmaking error', errorCode(error, 'MATCH_FIND_ERROR'));
        void loadRoadmaps();
      } finally {
        searchInFlight.current = false;
      }
    };

    void search();
    const timer = window.setInterval(() => void search(), 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [loadRoadmaps, pollMatch, screen, selectedRoadmap, showToast]);

  const selectRoadmap = (roadmap: MatchRoadmap) => {
    if (!roadmap.eligible) return;
    setSelectedRoadmap(roadmap);
    setScreen('searching');
  };

  const answer = async (questionId: string, optionIndex: number) => {
    const current = matchRef.current;
    if (!current?.current_question || current.current_question.id !== questionId || current.you_answered_current || submitting || selectedOption !== null) return;

    setSelectedOption(optionIndex);
    setSubmitting(true);
    try {
      await submitMatchAnswerApi(current.id, { question_id: questionId, selected_option_index: optionIndex });
      await pollMatch(current.id);
    } catch (error: any) {
      const code = errorCode(error, 'ANSWER_SUBMIT_ERROR');
      if (code !== 'question_already_answered') {
        setSelectedOption(null);
        showToast('error', 'Answer not submitted', code);
      }
      if (code === 'not_current_round' || code === 'question_already_answered') await pollMatch(current.id);
    } finally {
      setSubmitting(false);
    }
  };

  const playAgain = () => {
    matchRef.current = null;
    questionCache.current.clear();
    finishInFlight.current = false;
    setMatch(null);
    setResult(null);
    setReveal(null);
    setSelectedRoadmap(null);
    setScreen('picker');
    void loadRoadmaps();
  };

  const showArena = Boolean(match && (screen === 'in_game' || reveal));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white"><Swords className="h-8 w-8 text-purple-400" /> 1v1 PvP Arena</h1>
        <p className="mt-1 text-sm text-slate-400">Compete in real-time, roadmap-based knowledge duels.</p>
      </div>

      {screen === 'picker' && <RoadmapPicker roadmaps={roadmaps} loading={roadmapsLoading} error={roadmapsError} onSelect={selectRoadmap} onRetry={loadRoadmaps} />}
      {screen === 'searching' && selectedRoadmap && <MatchSearching roadmapTitle={selectedRoadmap.title} />}
      {showArena && match && <BattleArena match={match} selectedOption={selectedOption} submitting={submitting} reveal={reveal} onAnswer={answer} />}
      {screen === 'finished' && !reveal && result && match && <MatchResult result={result} totalRounds={match.total_rounds} onPlayAgain={playAgain} />}
      {screen === 'finished' && !reveal && !result && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>}
    </div>
  );
};
