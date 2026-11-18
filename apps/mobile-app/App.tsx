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
  UserRole
} from '@parshuram/shared';

// Luxury Brand Palette (Deep Navy, Pure White, Soft Silver, Champagne Gold)
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
  const [authRole, setAuthRole] = useState<UserRole>('member');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Active Tab per role
  const [activeTab, setActiveTab] = useState<string>('home');

  // Shared Data States
  const [members, setMembers] = useState<any[]>([...(api as any).store.members]);
  const [employees, setEmployees] = useState<any[]>([...(api as any).store.employees]);
  const [staffAttendance, setStaffAttendance] = useState<any[]>([...(api as any).store.staffAttendance]);
  const [memberAttendance, setMemberAttendance] = useState<any[]>([...(api as any).store.memberAttendance]);
  const [leaveApps, setLeaveApps] = useState<any[]>([...(api as any).store.leaveApplications]);
  const [activeQR, setActiveQR] = useState<any>(null);

  // Form / Action States
  const [memberQRToken, setMemberQRToken] = useState('');
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Strength Coach');

  useEffect(() => {
    // Initialize active QR session
    api.getActiveQRSession().then(setActiveQR).catch(() => {});
  }, []);

  // Preset quick-login accounts
  const quickAccounts = [
    { label: 'Dave (Owner & Admin)', email: 'dave@parshuramgym.com', pass: 'DaveAdmin2026!', role: 'super_admin' },
    { label: 'Vikram (Coach & Staff)', email: 'vikram@parshuramgym.com', pass: 'VikramTrainer2026!', role: 'trainer' },
    { label: 'Rahul (Active Member)', email: 'rahul@example.com', pass: 'RahulMember2026!', role: 'member' }
  ];

  const handleLogin = async (email: string, pass: string) => {
    const store = (api as any).store;
    const prof = store.profiles.find((p: any) => p.email.toLowerCase() === email.trim().toLowerCase());

    if (!prof) {
      Alert.alert('Account Not Found', 'No registered profile matches this email.');
      return;
    }
    if (!prof.is_active) {
      Alert.alert('Access Denied', 'This account has been deactivated or archived.');
      return;
    }

    setSessionUser(prof);
    setAuthRole(prof.role);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setSessionUser(null);
    setEmailInput('');
    setPasswordInput('');
  };

  // MEMBER: Free QR Check-in
  const handleMemberCheckIn = async () => {
    if (!sessionUser) return;
    const store = (api as any).store;
    const mem = store.members.find((m: any) => m.profile_id === sessionUser.id) || store.members[0];

    try {
      const active = await api.getActiveQRSession();
      const token = memberQRToken.trim() || active.token;
      const res = await api.memberCheckIn(mem.id, token, 'qr');

      if (res.success) {
        setCheckInNotice(res.message);
        setMemberAttendance([...store.memberAttendance]);
        setMemberQRToken('');
      } else {
        setCheckInNotice(res.message);
      }
    } catch (err: any) {
      setCheckInNotice('Check-in error. Please verify session.');
    }
  };

  // EMPLOYEE: Shift Clock-In / Clock-Out
  const handleClockIn = async () => {
    const store = (api as any).store;
    const emp = store.employees.find((e: any) => e.profile_id === sessionUser.id) || store.employees[1];
    const active = await api.getActiveQRSession();
    const res = await api.employeeCheckIn(emp.id, active.token, 'qr');
    setStaffAttendance([...store.staffAttendance]);
    Alert.alert('Shift Recorded', res.message);
  };

  const handleClockOut = async () => {
    const store = (api as any).store;
    const emp = store.employees.find((e: any) => e.profile_id === sessionUser.id) || store.employees[1];
    const res = await api.employeeCheckOut(emp.id);
    setStaffAttendance([...store.staffAttendance]);
    Alert.alert('Shift Ended', res.message);
  };

  // EMPLOYEE: Submit Leave Request
  const handleSubmitLeave = async () => {
    if (!leaveReason.trim()) {
      Alert.alert('Required', 'Please enter a reason for leave.');
      return;
    }
    const store = (api as any).store;
    const emp = store.employees.find((e: any) => e.profile_id === sessionUser.id) || store.employees[1];

    await api.applyLeave({
      employeeId: emp.id,
      leaveTypeId: 'lt-1',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      reason: leaveReason.trim()
    });

    setLeaveApps([...store.leaveApplications]);
    setLeaveReason('');
    Alert.alert('Leave Submitted', 'Application sent to Dave for review.');
  };

  // OWNER: Add Member
  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      Alert.alert('Missing Fields', 'Please enter name and email.');
      return;
    }
    await api.registerMember({
      fullName: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase(),
      fitnessGoal: 'muscle_gain'
    });
    setMembers([...(api as any).store.members]);
    setNewMemberName('');
    setNewMemberEmail('');
    Alert.alert('Success', 'New member saved to database.');
  };

  // OWNER: Add Coach
  const handleAddCoach = async () => {
    if (!newEmpName.trim() || !newEmpEmail.trim()) {
      Alert.alert('Missing Fields', 'Please enter coach name and email.');
      return;
    }
    const store = (api as any).store;
    const prof = {
      id: `prof-emp-${Date.now()}`,
      user_id: `usr-emp-${Date.now()}`,
      full_name: newEmpName.trim(),
      email: newEmpEmail.trim().toLowerCase(),
      role: 'trainer' as UserRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const emp = {
      id: `emp-${Date.now()}`,
      profile_id: prof.id,
      department: 'Fitness Training',
      designation: newEmpRole,
      salary_type: 'monthly' as any,
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active' as any,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.profiles.push(prof);
    store.employees.push(emp);
    setEmployees([...store.employees]);
    setNewEmpName('');
    setNewEmpEmail('');
    Alert.alert('Coach Added', 'Coach is now live and synchronized with the website.');
  };

  // OWNER: Toggle Status (Active / Inactive / Archive)
  const handleToggleCoach = (empId: string, currentStatus: string) => {
    const store = (api as any).store;
    const target = store.employees.find((e: any) => e.id === empId);
    if (!target) return;
    target.status = currentStatus === 'active' ? 'inactive' : 'active';
    setEmployees([...store.employees]);
    Alert.alert('Status Updated', `Coach is now ${target.status}.`);
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: LOGIN SCREEN (if not signed in)
  // --------------------------------------------------------------------------
  if (!sessionUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
        <ScrollView contentContainerStyle={styles.authScroll}>
          {/* Brand Header */}
          <View style={styles.authLogoBox}>
            <View style={styles.emblemBadge}>
              <Text style={styles.emblemText}>PFG</Text>
            </View>
            <Text style={styles.authTitle}>PARSHURAM FITNESS</Text>
            <Text style={styles.authSubtitle}>DIVINE DISCIPLINE • UNIFIED ANDROID APP</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Sign In With Your Account</Text>

            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. dave@parshuramgym.com"
              placeholderTextColor={COLORS.textMuted}
              value={emailInput}
              onChangeText={setEmailInput}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.goldButton}
              onPress={() => handleLogin(emailInput, passwordInput)}
            >
              <Text style={styles.goldButtonText}>SIGN IN</Text>
            </TouchableOpacity>

            {/* Quick Demo Role Selector */}
            <View style={styles.divider} />
            <Text style={styles.sectionCaption}>ONE-TAP ROLE TESTING:</Text>
            {quickAccounts.map((acc, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickAccountBtn}
                onPress={() => handleLogin(acc.email, acc.pass)}
              >
                <View>
                  <Text style={styles.quickAccountTitle}>{acc.label}</Text>
                  <Text style={styles.quickAccountEmail}>{acc.email}</Text>
                </View>
                <Text style={styles.quickAccountArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 2: OWNER / ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  if (authRole === 'super_admin' || authRole === 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarRole}>OWNER &amp; SUPER ADMIN</Text>
            <Text style={styles.topBarName}>Dave • Executive Console</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsRow}>
          {['overview', 'members', 'coaches', 'attendance'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'overview' && (
            <View>
              {/* KPIs Grid */}
              <View style={styles.kpiRow}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiNum}>{members.length}</Text>
                  <Text style={styles.kpiLabel}>Total Members</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiNum}>{employees.filter((e) => e.status === 'active').length}</Text>
                  <Text style={styles.kpiLabel}>Active Coaches</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiNum}>{memberAttendance.length}</Text>
                  <Text style={styles.kpiLabel}>Visits Today</Text>
                </View>
              </View>

              {/* Live QR Token Box */}
              <View style={styles.card}>
                <Text style={styles.cardHeader}>ENTRANCE ATTENDANCE QR SESSION</Text>
                <Text style={styles.bodyText}>
                  Active Token: <Text style={styles.boldGold}>{activeQR?.token || 'PARSHURAM-SESSION'}</Text>
                </Text>
                <Text style={styles.hintText}>Auto-rotates to prevent forwarded QR codes. Zero fee for members.</Text>
              </View>

              {/* Pending Leaves Box */}
              <View style={styles.card}>
                <Text style={styles.cardHeader}>PENDING STAFF LEAVES ({leaveApps.filter((l) => l.status === 'pending').length})</Text>
                {leaveApps.filter((l) => l.status === 'pending').length === 0 ? (
                  <Text style={styles.hintText}>All staff leave applications reviewed.</Text>
                ) : (
                  leaveApps
                    .filter((l) => l.status === 'pending')
                    .map((l) => (
                      <View key={l.id} style={styles.listItem}>
                        <Text style={styles.listTitle}>{l.start_date} to {l.end_date}</Text>
                        <Text style={styles.bodyText}>&quot;{l.reason}&quot;</Text>
                      </View>
                    ))
                )}
              </View>
            </View>
          )}

          {activeTab === 'members' && (
            <View>
              {/* Add Member Form */}
              <View style={styles.card}>
                <Text style={styles.cardHeader}>ADD NEW GYM MEMBER</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name (e.g. Karan Singhania)"
                  placeholderTextColor={COLORS.textMuted}
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={COLORS.textMuted}
                  value={newMemberEmail}
                  onChangeText={setNewMemberEmail}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.goldButton} onPress={handleAddMember}>
                  <Text style={styles.goldButtonText}>REGISTER MEMBER</Text>
                </TouchableOpacity>
              </View>

              {/* Members List */}
              <View style={styles.card}>
                <Text style={styles.cardHeader}>MEMBER ROSTER ({members.length})</Text>
                {members.map((m) => (
                  <View key={m.id} style={styles.listItem}>
                    <View>
                      <Text style={styles.listTitle}>{m.id} • {m.fitness_goal}</Text>
                      <Text style={styles.hintText}>Status: {m.status.toUpperCase()} • Joined: {m.join_date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'coaches' && (
            <View>
              {/* Add Coach Form */}
              <View style={styles.card}>
                <Text style={styles.cardHeader}>ADD NEW COACH / STAFF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Coach Full Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={newEmpName}
                  onChangeText={setNewEmpName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Coach Email Address"
                  placeholderTextColor={COLORS.textMuted}
                  value={newEmpEmail}
                  onChangeText={setNewEmpEmail}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Designation (e.g. Biomechanics Coach)"
                  placeholderTextColor={COLORS.textMuted}
                  value={newEmpRole}
                  onChangeText={setNewEmpRole}
                />
                <TouchableOpacity style={styles.goldButton} onPress={handleAddCoach}>
                  <Text style={styles.goldButtonText}>ADD TO ACTIVE ROSTER</Text>
                </TouchableOpacity>
              </View>

              {/* Synchronized Coaches List */}
              <View style={styles.card}>
                <Text style={styles.cardHeader}>COACHING STAFF (SYNCS WITH WEBSITE)</Text>
                {employees.map((e) => (
                  <View key={e.id} style={styles.listItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle}>{e.id} • {e.designation}</Text>
                      <Text style={styles.hintText}>Status: {e.status.toUpperCase()}</Text>
                    </View>
                    {e.id !== 'emp-dave' && (
                      <TouchableOpacity
                        style={[styles.smallBtn, e.status === 'active' ? styles.btnDanger : styles.btnSuccess]}
                        onPress={() => handleToggleCoach(e.id, e.status)}
                      >
                        <Text style={styles.smallBtnText}>
                          {e.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'attendance' && (
            <View>
              <View style={styles.card}>
                <Text style={styles.cardHeader}>STAFF WORK SHIFTS ({staffAttendance.length})</Text>
                {staffAttendance.map((s) => (
                  <View key={s.id} style={styles.listItem}>
                    <Text style={styles.listTitle}>Employee: {s.employee_id}</Text>
                    <Text style={styles.hintText}>In: {new Date(s.check_in_time).toLocaleTimeString()}</Text>
                    {s.check_out_time ? (
                      <Text style={styles.hintText}>Out: {new Date(s.check_out_time).toLocaleTimeString()}</Text>
                    ) : (
                      <Text style={[styles.hintText, { color: COLORS.emerald }]}>SHIFT CURRENTLY ACTIVE</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 3: EMPLOYEE / COACH DASHBOARD
  // --------------------------------------------------------------------------
  if (authRole === 'trainer' || authRole === 'employee') {
    const isShiftActive = staffAttendance.some(
      (a) => a.employee_id === sessionUser.id && !a.check_out_time
    );

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarRole}>STAFF &amp; COACH TERMINAL</Text>
            <Text style={styles.topBarName}>{sessionUser.full_name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Shift Actions */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>DAILY WORK SHIFT</Text>
            <Text style={styles.bodyText}>
              Status: <Text style={isShiftActive ? styles.textSuccess : styles.textMuted}>{isShiftActive ? 'ACTIVE SHIFT' : 'OFF SHIFT'}</Text>
            </Text>

            <View style={{ marginTop: 12 }}>
              {!isShiftActive ? (
                <TouchableOpacity style={styles.emeraldButton} onPress={handleClockIn}>
                  <Text style={styles.btnFullText}>CLOCK IN (START SHIFT)</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.goldButton} onPress={handleClockOut}>
                  <Text style={styles.goldButtonText}>CLOCK OUT (END SHIFT)</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Leave Application */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>APPLY FOR LEAVE</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Reason for leave (reviewed by Dave)..."
              placeholderTextColor={COLORS.textMuted}
              value={leaveReason}
              onChangeText={setLeaveReason}
              multiline
            />
            <TouchableOpacity style={styles.goldButton} onPress={handleSubmitLeave}>
              <Text style={styles.goldButtonText}>SUBMIT LEAVE REQUEST</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 4: MEMBER ATHLETE DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarRole}>WARRIOR ATHLETE HUB</Text>
          <Text style={styles.topBarName}>Namaste, {sessionUser.full_name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 100% Free Daily Attendance */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>100% FREE DAILY ATTENDANCE</Text>
          <Text style={styles.hintText}>Zero charge. Enter active entrance desk token or tap check-in:</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter token (leave blank to auto-sync)..."
            placeholderTextColor={COLORS.textMuted}
            value={memberQRToken}
            onChangeText={setMemberQRToken}
          />

          <TouchableOpacity style={styles.goldButton} onPress={handleMemberCheckIn}>
            <Text style={styles.goldButtonText}>MARK FREE GYM VISIT</Text>
          </TouchableOpacity>

          {checkInNotice && (
            <Text style={[styles.hintText, { marginTop: 8, color: COLORS.emerald }]}>{checkInNotice}</Text>
          )}
        </View>

        {/* Workout Plan Preview */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>TODAY&apos;S WORKOUT SCHEDULE</Text>
          <Text style={styles.listTitle}>Heavy Compound Push Protocol</Text>
          <Text style={styles.bodyText}>• Bench Press: 4 Sets × 8 Reps</Text>
          <Text style={styles.bodyText}>• Standing Overhead Press: 3 Sets × 10 Reps</Text>
          <Text style={styles.bodyText}>• Parallel Bar Dips: 3 Sets × 12 Reps</Text>
        </View>

        {/* Indian Diet Blueprint */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>INDIAN NUTRITION BLUEPRINT</Text>
          <Text style={styles.listTitle}>High-Protein Desi Plan (2,600 kcal)</Text>
          <Text style={styles.bodyText}>• Breakfast: Oats + Almonds + 1 Scoop Whey</Text>
          <Text style={styles.bodyText}>• Lunch: 150g Paneer + Dal Tadka + 3 Rotis</Text>
          <Text style={styles.bodyText}>• Dinner: 65g Soya chunks curry + Curd</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navyDark
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  authLogoBox: {
    alignItems: 'center',
    marginBottom: 24
  },
  emblemBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.navyCard,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  emblemText: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: 20
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1.5
  },
  authSubtitle: {
    fontSize: 10,
    color: COLORS.gold,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4
  },
  card: {
    backgroundColor: COLORS.navyCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16
  },
  cardHeader: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 12
  },
  inputLabel: {
    color: COLORS.silver,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6
  },
  input: {
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 12,
    marginBottom: 12
  },
  goldButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4
  },
  goldButtonText: {
    color: COLORS.navyDark,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1
  },
  emeraldButton: {
    backgroundColor: COLORS.emerald,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  btnFullText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 12
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16
  },
  sectionCaption: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10
  },
  quickAccountBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8
  },
  quickAccountTitle: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12
  },
  quickAccountEmail: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2
  },
  quickAccountArrow: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '900'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.navyCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  topBarRole: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1
  },
  topBarName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2
  },
  logoutBtn: {
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  logoutBtnText: {
    color: COLORS.silver,
    fontSize: 11,
    fontWeight: '700'
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold
  },
  tabBtnText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  tabBtnTextActive: {
    color: COLORS.gold
  },
  scrollContent: {
    padding: 16
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.navyCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 3
  },
  kpiNum: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.gold
  },
  kpiLabel: {
    fontSize: 9,
    color: COLORS.silver,
    fontWeight: '700',
    marginTop: 2
  },
  bodyText: {
    color: COLORS.silver,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4
  },
  boldGold: {
    color: COLORS.gold,
    fontWeight: '900'
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  listTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700'
  },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  btnDanger: {
    backgroundColor: '#7F1D1D'
  },
  btnSuccess: {
    backgroundColor: '#065F46'
  },
  smallBtnText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700'
  },
  textSuccess: {
    color: COLORS.emerald,
    fontWeight: '700'
  },
  textMuted: {
    color: COLORS.textMuted
  }
});
