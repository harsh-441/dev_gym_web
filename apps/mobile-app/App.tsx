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
  INITIAL_MEMBERSHIP_PLANS,
  api,
} from '@parshuram/shared';

// Luxury Brand Palette (Deep Royal Navy, Crisp White, Soft Silver, Champagne Gold)
const COLORS = {
  navyDark: '#050B17',
  navy: '#0A1128',
  navyCard: '#101B37',
  navyElevated: '#17254A',
  border: '#1E305C',
  gold: '#D4AF37',
  goldHover: '#E5C158',
  silver: '#CBD5E1',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
  emerald: '#10B981',
  crimson: '#EF4444',
  amber: '#F59E0B'
};

export default function ParshuramUnifiedApp() {
  // Authentication State
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState('');
  const [authRole, setAuthRole] = useState<'super_admin' | 'admin' | 'member'>('member');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Active Tab per role
  const [activeTab, setActiveTab] = useState<string>('home');

  // Public app catalog data; account and attendance data use the authenticated web API.
  const [members, setMembers] = useState<any[]>([...(api as any).store.members]);
  const [memberAttendance, setMemberAttendance] = useState<any[]>([]);

  // Form / Action States
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleLogin = async (email: string, pass: string) => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
      if (!baseUrl) { Alert.alert('Configuration Required', 'Set EXPO_PUBLIC_API_URL to your deployed gym website URL.'); return; }
      const response = await fetch(`${baseUrl}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pass }) });
      const data = await response.json();
      if (!response.ok || !data.success) { Alert.alert('Login Error', data.error || 'Could not sign in.'); return; }
      if (!['super_admin', 'admin', 'member'].includes(data.user.role)) { Alert.alert('Access Removed', 'Staff and trainer sign-in is no longer available.'); return; }
      if (data.user.role === 'member') {
        const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, { headers: { Authorization: `Bearer ${data.token}` } });
        const attendanceData = await attendanceResponse.json();
        setMemberAttendance(attendanceData.attendance || []);
      } else {
        setMemberAttendance([]);
      }
      setAuthToken(data.token);
      setSessionUser({ id: data.user.id, full_name: data.user.name, email: data.user.email });
      setAuthRole(data.user.role);
      setActiveTab('home');
    } catch (e: any) {
      Alert.alert('Authentication Error', e.message);
    }
  };

  const handleLogout = () => {
    setSessionUser(null);
    setEmailInput('');
    setPasswordInput('');
    setActiveTab('home');
  };

  // Member Check-in action (Guaranteed 100% Free)
  const handleMemberCheckIn = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
    if (!baseUrl || !authToken) return;
    try {
      const response = await fetch(`${baseUrl}/api/attendance`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` }, body: JSON.stringify({}) });
      const result = await response.json();
      if (!response.ok) { Alert.alert('Check-In Notice', result.error || 'Could not check in.'); return; }
      setCheckInNotice(result.message || 'Attendance recorded successfully.');
      const historyResponse = await fetch(`${baseUrl}/api/attendance`, { headers: { Authorization: `Bearer ${authToken}` } });
      const history = await historyResponse.json();
      setMemberAttendance(history.attendance || []);
    } catch { Alert.alert('Check-In Error', 'Could not reach the gym service. Please try again.'); }
  };

  // ---------------- AUTH SCREEN ----------------
  if (!sessionUser) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
        <ScrollView contentContainerStyle={styles.authScroll}>
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoAxe}>⚔</Text>
            </View>
            <Text style={styles.brandTitle}>PARSHURAM</Text>
            <Text style={styles.brandSubtitle}>FITNESS CLUB</Text>
            <Text style={styles.tagline}>EST. 2016 • MEERUT, UP • OWNER: KAPIL DEV</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Sign In To Multi-Role App</Text>
            <Text style={styles.cardSub}>One unified Android app with real database synchronization</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={COLORS.textMuted}
                value={emailInput}
                onChangeText={setEmailInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor={COLORS.textMuted}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.goldButton}
              onPress={() => handleLogin(emailInput, passwordInput)}
            >
              <Text style={styles.goldButtonText}>SIGN IN</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------------- AUTHENTICATED DASHBOARD ----------------
  const isOwner = authRole === 'super_admin' || authRole === 'admin';
  const isMember = authRole === 'member';

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />

      {/* Top App Bar */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.appBarTitle}>PARSHURAM FITNESS CLUB</Text>
          <Text style={styles.appBarRole}>
            {sessionUser.full_name} • {authRole.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>EXIT</Text>
        </TouchableOpacity>
      </View>

      {/* Role Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        {isOwner && (
          <>
            <TouchableOpacity
              style={[styles.navItem, activeTab === 'members' && styles.navItemActive]}
              onPress={() => setActiveTab('members')}
            >
              <Text style={[styles.navText, activeTab === 'members' && styles.navTextActive]}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navItem, activeTab === 'plans' && styles.navItemActive]}
              onPress={() => setActiveTab('plans')}
            >
              <Text style={[styles.navText, activeTab === 'plans' && styles.navTextActive]}>Pricing</Text>
            </TouchableOpacity>
          </>
        )}

        {isMember && (
          <>
            <TouchableOpacity
              style={[styles.navItem, activeTab === 'attendance' && styles.navItemActive]}
              onPress={() => setActiveTab('attendance')}
            >
              <Text style={[styles.navText, activeTab === 'attendance' && styles.navTextActive]}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navItem, activeTab === 'workout' && styles.navItemActive]}
              onPress={() => setActiveTab('workout')}
            >
              <Text style={[styles.navText, activeTab === 'workout' && styles.navTextActive]}>Workouts</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <View style={styles.tabContent}>
            {/* Owner Overview Card */}
            {isOwner && (
              <View style={styles.card}>
                <Text style={styles.cardHeading}>Kapil Dev - Owner Executive Panel</Text>
                <Text style={styles.cardSub}>Database synchronized with website & floor station</Text>

                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{members.length}</Text>
                    <Text style={styles.statLabel}>TOTAL MEMBERS</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{memberAttendance.length}</Text>
                    <Text style={styles.statLabel}>CHECK-INS</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>₹500+</Text>
                    <Text style={styles.statLabel}>MEMBERSHIPS</Text>
                  </View>
                </View>

              </View>
            )}

            {/* Member Card */}
            {isMember && (
              <View style={styles.card}>
                <Text style={styles.cardHeading}>Member Personal Hub</Text>
                <Text style={styles.cardSub}>Parshuram Fitness Club • Est. 2016 in Meerut</Text>

                <View style={styles.checkInBox}>
                  <Text style={styles.inputLabel}>TODAY ATTENDANCE CHECK-IN (FREE)</Text>
                  <TouchableOpacity style={styles.goldButton} onPress={handleMemberCheckIn}>
                    <Text style={styles.goldButtonText}>CHECK IN TODAY</Text>
                  </TouchableOpacity>
                  {checkInNotice && <Text style={styles.noticeText}>{checkInNotice}</Text>}
                </View>

                <View style={styles.infoBanner}>
                  <Text style={styles.infoTitle}>Gym Operating Hours (Mon-Sat):</Text>
                  <Text style={styles.infoSub}>• Morning: 5:30 AM – 10:00 AM</Text>
                  <Text style={styles.infoSub}>• Evening: 5:00 PM – 10:00 PM</Text>
                  <Text style={[styles.infoSub, { color: COLORS.crimson, marginTop: 4 }]}>Sunday: CLOSED</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB: MEMBERS (Owner Only) */}
        {activeTab === 'members' && isOwner && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Manage Registered Members</Text>
              <Text style={styles.cardSub}>Total Registered: {members.length}</Text>

              {members.map((m, i) => {
                const prof = (api as any).store.profiles.find((p: any) => p.id === m.profile_id);
                return (
                  <View key={i} style={styles.memberRow}>
                    <View>
                      <Text style={styles.memberName}>{prof?.full_name || 'Member'}</Text>
                      <Text style={styles.memberSub}>{prof?.email} • {m.fitness_goal}</Text>
                    </View>
                    <Text style={styles.statusBadge}>{m.status.toUpperCase()}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB: PRICING PLANS */}
        {activeTab === 'plans' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Official Membership Packages</Text>
              <Text style={styles.cardSub}>Parshuram Fitness Club - Meerut</Text>

              {INITIAL_MEMBERSHIP_PLANS.map((plan, i) => (
                <View key={i} style={styles.planBox}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>₹{plan.price.toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={styles.planDesc}>{plan.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB: WORKOUTS (Member) */}
        {activeTab === 'workout' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Exercise Movement Library</Text>
              <Text style={styles.cardSub}>Calibrated Barbell, Cardio & Functional Training</Text>

              {INITIAL_EXERCISES.slice(0, 5).map((ex, i) => (
                <View key={i} style={styles.exerciseItem}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exCategory}>{ex.category.toUpperCase()} • {ex.equipment}</Text>
                  <Text style={styles.exInstructions}>{ex.instructions[0]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.navyDark
  },
  authScroll: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%'
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.navyCard,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  logoAxe: {
    fontSize: 26,
    color: COLORS.gold
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2
  },
  brandSubtitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 3
  },
  tagline: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.silver,
    letterSpacing: 1.5,
    marginTop: 4
  },
  card: {
    backgroundColor: COLORS.navyCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    textTransform: 'uppercase'
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 16
  },
  inputGroup: {
    marginBottom: 14
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.silver,
    marginBottom: 6,
    letterSpacing: 1
  },
  input: {
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 13
  },
  goldButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6
  },
  goldButtonText: {
    color: COLORS.navyDark,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16
  },
  demoHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.silver,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10
  },
  roleAccountButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white
  },
  roleEmail: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  roleBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.gold,
    backgroundColor: COLORS.navyElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.navy,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  appBarTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1
  },
  appBarRole: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '600'
  },
  logoutBtn: {
    backgroundColor: COLORS.navyCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  logoutText: {
    color: COLORS.crimson,
    fontSize: 11,
    fontWeight: '800'
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  navItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold
  },
  navText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted
  },
  navTextActive: {
    color: COLORS.white
  },
  contentScroll: {
    padding: 16
  },
  tabContent: {
    flex: 1
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.navy,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.silver,
    marginTop: 2
  },
  qrSessionBox: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginTop: 10,
    alignItems: 'center'
  },
  qrHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white
  },
  qrToken: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gold,
    marginVertical: 4
  },
  qrSub: {
    fontSize: 10,
    color: COLORS.emerald
  },
  clockRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  actionBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.silver,
    marginTop: 12,
    marginBottom: 6
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  historyTime: {
    fontSize: 12,
    color: COLORS.white
  },
  historyStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emerald
  },
  checkInBox: {
    marginTop: 6
  },
  noticeText: {
    fontSize: 11,
    color: COLORS.emerald,
    marginTop: 6,
    textAlign: 'center'
  },
  infoBanner: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.gold,
    marginBottom: 4
  },
  infoSub: {
    fontSize: 11,
    color: COLORS.silver
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  memberName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white
  },
  memberSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  statusBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.emerald,
    backgroundColor: COLORS.navyElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  planBox: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  planName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.gold
  },
  planDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4
  },
  exerciseItem: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8
  },
  exName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white
  },
  exCategory: {
    fontSize: 10,
    color: COLORS.gold,
    marginVertical: 2
  },
  exInstructions: {
    fontSize: 11,
    color: COLORS.silver
  }
});
