import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getRoadmapsApi, getRoadmapUnitsApi, getUnitDetailsApi, submitUnitTestApi } from '../api/roadmapsApi';
import { Roadmap, Unit, UnitDetail, UnitTestSubmitResponse } from '../types';
import { RoadmapTabs } from '../components/roadmaps/RoadmapTabs';
import { UnitList } from '../components/roadmaps/UnitList';
import { UnitDetailPanel } from '../components/roadmaps/UnitDetailPanel';
import { QuizModal } from '../components/roadmaps/QuizModal';
import { BookOpen } from 'lucide-react';

export const RoadmapsPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitDetail, setUnitDetail] = useState<UnitDetail | null>(null);
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<UnitTestSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRoadmapsApi();
        setRoadmaps(data || []);
        if (data?.length) setSelectedRoadmap(data[0]);
      } catch (err: any) {
        showToast('error', 'Failed to load roadmaps', err?.response?.data?.error || 'ROADMAPS_FETCH_ERROR');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedRoadmap) return;
    const load = async () => {
      try {
        const data = await getRoadmapUnitsApi(selectedRoadmap.id);
        setUnits(data || []);
        setSelectedUnit(null);
        setUnitDetail(null);
      } catch (err: any) {
        showToast('error', 'Failed to load units', err?.response?.data?.error || 'UNITS_FETCH_ERROR');
      }
    };
    load();
  }, [selectedRoadmap]);

  const handleSelectUnit = async (unit: Unit) => {
    setSelectedUnit(unit);
    try {
      const data = await getUnitDetailsApi(unit.id);
      setUnitDetail(data);
    } catch (err: any) {
      showToast('error', 'Failed to load unit details', err?.response?.data?.error || 'UNIT_FETCH_ERROR');
    }
  };

  const handleStartTest = () => {
    if (!unitDetail?.questions?.length) return;
    setUserAnswers({});
    setTestResult(null);
    setQuizOpen(true);
  };

  const handleSubmitTest = async () => {
    if (!unitDetail || !selectedRoadmap) return;
    setSubmitting(true);
    try {
      const data = await submitUnitTestApi(unitDetail.id, {
        answers: Object.entries(userAnswers).map(([question_id, selected_option_index]) => ({
          question_id,
          selected_option_index
        }))
      });
      setTestResult(data);
      refreshUser({ topics_completed: data.topics_completed });

      if (data.passed) {
        showToast('success', 'Unit completed!', `Score: ${data.score}%`);
        const freshUnits = await getRoadmapUnitsApi(selectedRoadmap.id);
        setUnits(freshUnits || []);
      } else {
        showToast('error', 'Test failed', `Score: ${data.score}% — required ≥75%`);
      }
    } catch (err: any) {
      showToast('error', 'Test submission failed', err?.response?.data?.error || 'TEST_SUBMIT_ERROR');
      setQuizOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#172018] tracking-[-0.04em] flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f9bd] text-[#628900]"><BookOpen className="w-6 h-6" /></span>
          Roadmaps & Units
        </h1>
        <p className="text-sm text-[#68756c] mt-2">
          Select a direction, study the materials and take the unit test
        </p>
      </div>

      <RoadmapTabs
        roadmaps={roadmaps}
        selectedId={selectedRoadmap?.id}
        onSelect={(rm) => setSelectedRoadmap(rm)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-lg font-extrabold text-[#172018]">Units</h2>
          <UnitList
            units={units}
            selectedId={selectedUnit?.id}
            onSelect={handleSelectUnit}
          />
        </div>

        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 min-h-[400px]">
            <UnitDetailPanel unitDetail={unitDetail} onStartTest={handleStartTest} />
          </div>
        </div>
      </div>

      {quizOpen && unitDetail && (
        <QuizModal
          unitDetail={unitDetail}
          userAnswers={userAnswers}
          testResult={testResult}
          submitting={submitting}
          onAnswer={(qId, optIdx) => setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }))}
          onSubmit={handleSubmitTest}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </div>
  );
};
