import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import {
  BRAND,
  DEFAULT_APP_SETTINGS,
  INITIAL_EXERCISES,
  INITIAL_DIET_PLANS,
  api,
  generatePersonalizedFitnessPlan
} from '@parshuram/shared';

export default function MemberApp() {
  const [currentTab, setCurrentTab] = useState<'home' | 'attendance' | 'workouts' | 'diet' | 'profile'>('home');
  const [member, setMember] = useState<any>((api as any).store.members[0]);
  const [attendanceList, setAttendanceList] = useState<any[]>([...(api as any).store.memberAttendance]);

  // Attendance state
  const [qrToken, setQrToken] = useState('');
  const [attendanceMessage, setAttendanceMessage] = useState<string | null>(null);

  // Exercise category filter
  const [exerciseFilter, setExerciseFilter] = useState('all');

  // AI Planner Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAge, setAiAge] = useState('26');
  const [aiHeight, setAiHeight] = useState('175');
  const [aiWeight, setAiWeight] = useState('74');
  const [aiGoal, setAiGoal] = useState<any>('muscle_gain');
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState<any>(null);

  // Weight tracking
  const [weightInput, setWeightInput] = useState(member?.weight_kg?.toString() || '74');
  const [weightLoggedSuccess, setWeightLoggedSuccess] = useState(false);

  const handleMarkAttendance = async () => {
    try {
      const activeSession = await api.getActiveQRSession();
      const tokenToVerify = qrToken.trim() || activeSession.token;

      const res = await api.memberCheckIn(member.id, tokenToVerify, 'qr');
      setAttendanceMessage(res.message);
      if (res.success) {
        setAttendanceList([...(api as any).store.memberAttendance]);
        setQrToken('');
      }
    } catch (err: any) {
      setAttendanceMessage('Check-in error. Please try again.');
    }
  };

  const handleGenerateAIPlan = () => {
    const plan = generatePersonalizedFitnessPlan({
      age: Number(aiAge) || 25,
      height_cm: Number(aiHeight) || 175,
      weight_kg: Number(aiWeight) || 72,
      fitness_goal: aiGoal,
      training_experience: 'intermediate',
      activity_level: 'moderately_active',
      dietary_preference: 'vegetarian',
      available_equipment: 'full_gym',
      training_days_per_week: 4,
      workout_duration_minutes: 60
    });
    setAiGeneratedPlan(plan);
  };

  const filteredExercises = exerciseFilter === 'all'
    ? INITIAL_EXERCISES
    : INITIAL_EXERCISES.filter((e) => e.category === exerciseFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* Top Mobile Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>PFG</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>{BRAND.name}</Text>
            <Text style={styles.brandSubtitle}>MEMBER APP • OWNER: {BRAND.owner}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setCurrentTab('attendance')}
          style={styles.headerScanBtn}
        >
          <Text style={styles.headerScanBtnText}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Screen Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <View style={styles.screenSection}>
            {/* Greeting Banner */}
            <View style={styles.cardPrimary}>
              <Text style={styles.badgeText}>WARRIOR PROFILE</Text>
              <Text style={styles.titleLarge}>Namaste, Rahul</Text>
              <Text style={styles.paragraphMuted}>
                Goal: <Text style={styles.textRed}>Muscle Hypertrophy</Text> • Plan: Quarterly Discipline
              </Text>
              <View style={styles.divider} />
              <View style={styles.rowBetween}>
                <Text style={styles.textSilver}>Floor Check-In Status:</Text>
                <Text style={styles.textGreen}>100% Free</Text>
              </View>
            </View>

            {/* Quick Free Attendance Shortcut */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>DAILY GYM ATTENDANCE</Text>
              <Text style={styles.paragraph}>
                Scan the active QR screen at the reception desk to record your visit.
              </Text>
              <TouchableOpacity
                onPress={() => setCurrentTab('attendance')}
                style={styles.btnRed}
              >
                <Text style={styles.btnText}>Open QR Attendance Screen</Text>
              </TouchableOpacity>
            </View>

            {/* Today's Workout Quick View */}
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeader}>TODAY&apos;S WORKOUT</Text>
                <Text style={styles.badgeRed}>PUSH A</Text>
              </View>
              <Text style={styles.titleMedium}>Barbell Bench Press &amp; Delts</Text>
              <Text style={styles.paragraphMuted}>
                • Barbell Flat Bench: 4 sets × 8 reps{'\n'}
                • Overhead Military Press: 3 sets × 8-10 reps{'\n'}
                • Parallel Bar Dips: 3 sets × 12 reps
              </Text>
              <TouchableOpacity
                onPress={() => setCurrentTab('workouts')}
                style={styles.btnDark}
              >
                <Text style={styles.btnDarkText}>View Exercise Guides</Text>
              </TouchableOpacity>
            </View>

            {/* AI Planner Banner */}
            <View style={styles.cardRedBorder}>
              <Text style={styles.badgeSilver}>AI INTELLIGENCE</Text>
              <Text style={styles.titleMedium}>Customized Workout &amp; Desi Nutrition</Text>
              <Text style={styles.paragraphMuted}>
                Generate target calories, macros, and Indian vegetarian/non-vegetarian meal blueprints.
              </Text>
              <TouchableOpacity
                onPress={() => setAiModalOpen(true)}
                style={styles.btnRed}
              >
                <Text style={styles.btnText}>Open AI Fitness Planner</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: ATTENDANCE & QR SCANNER */}
        {currentTab === 'attendance' && (
          <View style={styles.screenSection}>
            <View style={styles.cardRedBorder}>
              <Text style={styles.cardHeader}>QR ATTENDANCE MARKER</Text>
              <Text style={styles.paragraphMuted}>
                Attendance is completely free for all members. Scan the QR token displayed on the reception desk terminal or enter the code.
              </Text>

              {/* QR Mock Frame */}
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrIconText}>[ QR TERMINAL ]</Text>
                <Text style={styles.qrSubtext}>Camera Scanner Mode Active</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Or paste active session token..."
                placeholderTextColor="#777"
                value={qrToken}
                onChangeText={setQrToken}
              />

              <TouchableOpacity onPress={handleMarkAttendance} style={styles.btnRed}>
                <Text style={styles.btnText}>Confirm Free Attendance</Text>
              </TouchableOpacity>

              {attendanceMessage && (
                <View style={styles.msgBox}>
                  <Text style={styles.msgText}>{attendanceMessage}</Text>
                </View>
              )}
            </View>

            {/* Attendance History */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>ATTENDANCE HISTORY</Text>
              {attendanceList.map((att, idx) => (
                <View key={idx} style={styles.historyRow}>
                  <Text style={styles.historyTime}>
                    {new Date(att.check_in_time).toLocaleDateString()} at{' '}
                    {new Date(att.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.historyBadge}>FREE</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: WORKOUTS & EXERCISES */}
        {currentTab === 'workouts' && (
          <View style={styles.screenSection}>
            <Text style={styles.screenTitle}>Exercise Library</Text>
            <Text style={styles.paragraphMuted}>
              Biomechanical cues and form checklists curated by Dave.
            </Text>

            {/* Muscle Filter Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {['all', 'chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'cardio'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setExerciseFilter(cat)}
                  style={[styles.catPill, exerciseFilter === cat && styles.catPillActive]}
                >
                  <Text style={[styles.catPillText, exerciseFilter === cat && styles.catPillTextActive]}>
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredExercises.map((ex) => (
              <View key={ex.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleMedium}>{ex.name}</Text>
                  <Text style={styles.badgeRed}>{ex.difficulty}</Text>
                </View>
                <Text style={styles.textSilver}>
                  Muscles: {ex.target_muscles.join(', ')}
                </Text>
                <Text style={styles.textMuted}>Equipment: {ex.equipment}</Text>
                <View style={styles.divider} />
                <Text style={styles.textWhiteBold}>Primary Form Cue:</Text>
                <Text style={styles.paragraphMuted}>{ex.instructions[0]}</Text>
                <Text style={styles.historyTime}>{ex.sets} Sets × {ex.reps} Reps</Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: NUTRITION */}
        {currentTab === 'diet' && (
          <View style={styles.screenSection}>
            <Text style={styles.screenTitle}>Indian Nutrition &amp; Diets</Text>
            <Text style={styles.paragraphMuted}>
              High-protein vegetarian, affordable student meal plans, and macro tracking.
            </Text>

            {INITIAL_DIET_PLANS.map((plan) => (
              <View key={plan.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleMedium}>{plan.title}</Text>
                  <Text style={styles.badgeGreen}>{plan.is_veg ? '100% VEG' : 'NON-VEG'}</Text>
                </View>
                <Text style={styles.paragraphMuted}>{plan.description}</Text>

                <View style={styles.macroGrid}>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroVal}>{plan.calories}</Text>
                    <Text style={styles.macroLbl}>Calories</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={[styles.macroVal, styles.textRed]}>{plan.protein_g}g</Text>
                    <Text style={styles.macroLbl}>Protein</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroVal}>{plan.carbs_g}g</Text>
                    <Text style={styles.macroLbl}>Carbs</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroVal}>{plan.fat_g}g</Text>
                    <Text style={styles.macroLbl}>Fats</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 5: PROFILE & PROGRESS */}
        {currentTab === 'profile' && (
          <View style={styles.screenSection}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardHeader}>MEMBER PROFILE</Text>
              <Text style={styles.titleLarge}>Rahul Varma</Text>
              <Text style={styles.paragraphMuted}>rahul@example.com</Text>
              <Text style={styles.paragraphMuted}>Member ID: mem-rahul • Enrolled: 2026-01-10</Text>
            </View>

            {/* Weight Logging Box */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>LOG TODAY&apos;S WEIGHT</Text>
              <Text style={styles.paragraphMuted}>Track morning fasting bodyweight weekly:</Text>
              <View style={styles.rowBetween}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  keyboardType="numeric"
                  value={weightInput}
                  onChangeText={setWeightInput}
                />
                <TouchableOpacity
                  onPress={() => setWeightLoggedSuccess(true)}
                  style={styles.btnRedSmall}
                >
                  <Text style={styles.btnText}>Log Weight</Text>
                </TouchableOpacity>
              </View>
              {weightLoggedSuccess && (
                <Text style={styles.textGreen}>Weight logged successfully!</Text>
              )}
            </View>

            {/* Gym Info & Dave Front Desk */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>GYM FACILITY &amp; SUPPORT</Text>
              <Text style={styles.paragraphMuted}>
                {BRAND.name} (Founder: {BRAND.owner}){'\n'}
                Facility Address: {DEFAULT_APP_SETTINGS.address_line1}{'\n'}
                Contact Phone: {DEFAULT_APP_SETTINGS.contact_phone}{'\n'}
                Hours: {DEFAULT_APP_SETTINGS.opening_hours_weekdays}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentTab('home')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('attendance')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'attendance' && styles.navTextActive]}>QR Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('workouts')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'workouts' && styles.navTextActive]}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('diet')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'diet' && styles.navTextActive]}>Diet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('profile')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* AI Planner Modal */}
      <Modal visible={aiModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.titleMedium}>AI Fitness &amp; Nutrition Planner</Text>
              <TouchableOpacity onPress={() => setAiModalOpen(false)}>
                <Text style={styles.textRed}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 15 }}>
              <Text style={styles.textMuted}>Enter Biometrics:</Text>
              <View style={styles.rowBetween}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 6 }]}
                  placeholder="Age"
                  placeholderTextColor="#777"
                  value={aiAge}
                  onChangeText={setAiAge}
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 6 }]}
                  placeholder="Height cm"
                  placeholderTextColor="#777"
                  value={aiHeight}
                  onChangeText={setAiHeight}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Weight kg"
                  placeholderTextColor="#777"
                  value={aiWeight}
                  onChangeText={setAiWeight}
                />
              </View>

              <TouchableOpacity onPress={handleGenerateAIPlan} style={styles.btnRed}>
                <Text style={styles.btnText}>Generate Custom Plan</Text>
              </TouchableOpacity>

              {aiGeneratedPlan && (
                <View style={styles.aiResultCard}>
                  <Text style={styles.badgeText}>CALIBRATED TARGETS</Text>
                  <Text style={styles.titleMedium}>
                    Daily Calories: {aiGeneratedPlan.overview.daily_calories} kcal
                  </Text>
                  <Text style={styles.textSilver}>
                    Protein: {aiGeneratedPlan.overview.macro_split.protein_g}g | Carbs: {aiGeneratedPlan.overview.macro_split.carbs_g}g | Fat: {aiGeneratedPlan.overview.macro_split.fat_g}g
                  </Text>
                  <Text style={styles.paragraphMuted}>{aiGeneratedPlan.overview.advice}</Text>
                  <Text style={[styles.textMuted, { fontSize: 10, marginTop: 8 }]}>
                    Disclaimer: Informational only. Not medical advice.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808'
  },
  header: {
    height: 60,
    backgroundColor: '#171717',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E02025',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  logoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14
  },
  brandTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5
  },
  brandSubtitle: {
    color: '#A0A0A0',
    fontSize: 9,
    fontWeight: '600'
  },
  headerScanBtn: {
    backgroundColor: '#E02025',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  headerScanBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80
  },
  screenSection: {
    gap: 16
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'uppercase'
  },
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2e2e2e'
  },
  cardPrimary: {
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333'
  },
  cardRedBorder: {
    backgroundColor: '#1F1F1F',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(224, 32, 37, 0.6)'
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E02025',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6
  },
  titleLarge: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    textTransform: 'uppercase'
  },
  titleMedium: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF'
  },
  paragraph: {
    fontSize: 12,
    color: '#DDD',
    lineHeight: 18,
    marginVertical: 4
  },
  paragraphMuted: {
    fontSize: 12,
    color: '#A0A0A0',
    lineHeight: 17,
    marginTop: 4
  },
  divider: {
    height: 1,
    backgroundColor: '#2e2e2e',
    marginVertical: 10
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badgeText: {
    fontSize: 10,
    color: '#E02025',
    fontWeight: 'bold',
    letterSpacing: 1
  },
  badgeRed: {
    fontSize: 9,
    color: '#FFF',
    backgroundColor: '#E02025',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold'
  },
  badgeGreen: {
    fontSize: 9,
    color: '#6EE7B7',
    backgroundColor: '#064E3B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold'
  },
  badgeSilver: {
    fontSize: 10,
    color: '#C0C0C0',
    fontWeight: 'bold'
  },
  textRed: {
    color: '#E02025',
    fontWeight: 'bold'
  },
  textSilver: {
    color: '#C0C0C0',
    fontSize: 12
  },
  textWhiteBold: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  textGreen: {
    color: '#34D399',
    fontWeight: 'bold',
    fontSize: 12
  },
  textMuted: {
    color: '#888',
    fontSize: 11
  },
  btnRed: {
    backgroundColor: '#E02025',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  btnRedSmall: {
    backgroundColor: '#E02025',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center'
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  btnDark: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  btnDarkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFF',
    fontSize: 12,
    marginTop: 8
  },
  qrPlaceholder: {
    height: 120,
    backgroundColor: '#121212',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e2e2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12
  },
  qrIconText: {
    color: '#E02025',
    fontWeight: 'bold',
    fontSize: 16
  },
  qrSubtext: {
    color: '#777',
    fontSize: 10,
    marginTop: 4
  },
  msgBox: {
    backgroundColor: '#14251a',
    borderWidth: 1,
    borderColor: '#246536',
    borderRadius: 8,
    padding: 10,
    marginTop: 10
  },
  msgText: {
    color: '#4ADE80',
    fontSize: 11,
    textAlign: 'center'
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#262626'
  },
  historyTime: {
    color: '#DDD',
    fontSize: 11
  },
  historyBadge: {
    color: '#34D399',
    fontWeight: 'bold',
    fontSize: 10
  },
  categoryScroll: {
    marginVertical: 10
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8
  },
  catPillActive: {
    backgroundColor: '#E02025',
    borderColor: '#E02025'
  },
  catPillText: {
    color: '#AAA',
    fontSize: 10,
    fontWeight: 'bold'
  },
  catPillTextActive: {
    color: '#FFF'
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  macroBox: {
    backgroundColor: '#171717',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '23%'
  },
  macroVal: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  macroLbl: {
    color: '#888',
    fontSize: 9
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: {
    alignItems: 'center'
  },
  navText: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  navTextActive: {
    color: '#E02025'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%'
  },
  aiResultCard: {
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 15
  }
});
