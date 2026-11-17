import React, { useState } from 'react';
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
  INITIAL_LEAVE_TYPES,
  api,
  validateLeaveApplication
} from '@parshuram/shared';

export default function EmployeeApp() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'attendance' | 'leaves' | 'schedule' | 'profile'>('dashboard');
  const [employee, setEmployee] = useState<any>((api as any).store.employees[1]); // Coach Vikram
  const [staffAttendance, setStaffAttendance] = useState<any[]>([...(api as any).store.staffAttendance]);
  const [leaves, setLeaves] = useState<any[]>([...(api as any).store.leaveApplications]);

  // Clock in/out states
  const [clockLoading, setClockLoading] = useState(false);
  const [clockMessage, setClockMessage] = useState<string | null>(null);

  // Leave modal states
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState('lt-1');
  const [startDate, setStartDate] = useState('2026-12-05');
  const [endDate, setEndDate] = useState('2026-12-06');
  const [reason, setReason] = useState('');
  const [leaveFeedback, setLeaveFeedback] = useState<string | null>(null);

  const activeShift = staffAttendance.find(
    (a) => a.employee_id === employee.id && !a.check_out_time
  );

  const handleClockIn = async () => {
    setClockLoading(true);
    setClockMessage(null);
    try {
      const activeSession = await api.getActiveQRSession();
      const res = await api.employeeCheckIn(employee.id, activeSession.token, 'qr');
      setClockMessage(res.message);
      if (res.success) {
        setStaffAttendance([...(api as any).store.staffAttendance]);
      }
    } catch (err: any) {
      setClockMessage('Error checking in.');
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    setClockMessage(null);
    try {
      const res = await api.employeeCheckOut(employee.id);
      setClockMessage(res.message);
      if (res.success) {
        setStaffAttendance([...(api as any).store.staffAttendance]);
      }
    } catch (err: any) {
      setClockMessage('Error checking out.');
    } finally {
      setClockLoading(false);
    }
  };

  const handleApplyLeave = async () => {
    const validation = validateLeaveApplication({
      employeeId: employee.id,
      leaveTypeId: selectedLeaveType,
      startDate,
      endDate,
      reason
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setLeaveFeedback(firstError);
      return;
    }

    const res = await api.applyLeave({
      employeeId: employee.id,
      leaveTypeId: selectedLeaveType,
      startDate,
      endDate,
      reason
    });

    setLeaveFeedback(res.message);
    if (res.success) {
      setLeaves([...(api as any).store.leaveApplications]);
      setReason('');
      setTimeout(() => {
        setLeaveModalOpen(false);
        setLeaveFeedback(null);
      }, 1500);
    }
  };

  const myLeaves = leaves.filter((l) => l.employee_id === employee.id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>PFG</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>{BRAND.name}</Text>
            <Text style={styles.brandSubtitle}>STAFF &amp; COACH PORTAL</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setLeaveModalOpen(true)}
          style={styles.headerActionBtn}
        >
          <Text style={styles.headerActionBtnText}>+ Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <View style={styles.section}>
            {/* Coach Profile Card */}
            <View style={styles.cardPrimary}>
              <Text style={styles.badgeSilver}>STAFF PROFILE</Text>
              <Text style={styles.titleLarge}>Vikram Rathore</Text>
              <Text style={styles.paragraphMuted}>
                Role: Senior Strength Coach • Operations{'\n'}
                Supervised by Owner Dave
              </Text>
              <View style={styles.divider} />
              <View style={styles.rowBetween}>
                <Text style={styles.textSilver}>Shift Status:</Text>
                <Text style={activeShift ? styles.textGreen : styles.textRed}>
                  {activeShift ? 'Currently Active On Floor' : 'Shift Off'}
                </Text>
              </View>
            </View>

            {/* Shift Check-In / Check-Out */}
            <View style={styles.cardRedBorder}>
              <Text style={styles.cardHeader}>STAFF ATTENDANCE CLOCK</Text>
              <Text style={styles.paragraphMuted}>
                Strict server timestamp tracking. Distinct from member visits.
              </Text>

              <View style={{ marginVertical: 10 }}>
                {!activeShift ? (
                  <TouchableOpacity
                    onPress={handleClockIn}
                    disabled={clockLoading}
                    style={styles.btnGreen}
                  >
                    <Text style={styles.btnText}>
                      {clockLoading ? 'Recording Check-In...' : 'Clock In (Start Work Shift)'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleClockOut}
                    disabled={clockLoading}
                    style={styles.btnRed}
                  >
                    <Text style={styles.btnText}>
                      {clockLoading ? 'Calculating Duration...' : 'Clock Out (Finish Shift)'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {clockMessage && (
                <View style={styles.msgBox}>
                  <Text style={styles.msgText}>{clockMessage}</Text>
                </View>
              )}
            </View>

            {/* Quick Leave Shortcut */}
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeader}>LEAVE APPLICATION</Text>
                <Text style={styles.badgeRed}>{myLeaves.length} History</Text>
              </View>
              <Text style={styles.paragraphMuted}>
                Submit sick, casual, or emergency leave requests directly to Dave.
              </Text>
              <TouchableOpacity
                onPress={() => setLeaveModalOpen(true)}
                style={styles.btnDark}
              >
                <Text style={styles.btnDarkText}>Apply For Leave</Text>
              </TouchableOpacity>
            </View>

            {/* Shift Rules */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>OPERATIONAL ANNOUNCEMENT</Text>
              <Text style={styles.paragraphMuted}>
                &quot;All coaches must be present on the floor 10 minutes prior to opening for barbell rack inspections and safety checks.&quot; — Dave
              </Text>
            </View>
          </View>
        )}

        {/* TAB 2: ATTENDANCE HISTORY */}
        {currentTab === 'attendance' && (
          <View style={styles.section}>
            <Text style={styles.screenTitle}>Staff Shift History</Text>
            <Text style={styles.paragraphMuted}>
              Logged shifts, check-in, check-out, and calculated hours.
            </Text>

            {staffAttendance.map((rec) => (
              <View key={rec.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleMedium}>
                    {new Date(rec.check_in_time).toLocaleDateString()}
                  </Text>
                  <Text style={styles.badgeSilver}>
                    {rec.shift_hours ? `${rec.shift_hours} hrs` : 'In Progress'}
                  </Text>
                </View>
                <Text style={styles.paragraphMuted}>
                  In: {new Date(rec.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{'\n'}
                  Out: {rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active on floor'}
                </Text>
                <View style={styles.divider} />
                <Text style={styles.textGreen}>Status: {rec.status.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: LEAVES */}
        {currentTab === 'leaves' && (
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text style={styles.screenTitle}>Leave Requests</Text>
              <TouchableOpacity
                onPress={() => setLeaveModalOpen(true)}
                style={styles.headerActionBtn}
              >
                <Text style={styles.headerActionBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {myLeaves.map((leave) => (
              <View key={leave.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleMedium}>{leave.start_date} to {leave.end_date}</Text>
                  <Text style={[styles.badgeRed, leave.status === 'approved' && styles.badgeGreen]}>
                    {leave.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.paragraphMuted}>Reason: {leave.reason}</Text>
                {leave.admin_note ? (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>Dave: &quot;{leave.admin_note}&quot;</Text>
                  </View>
                ) : (
                  <Text style={[styles.textMuted, { marginTop: 6 }]}>Awaiting review by Dave.</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: SCHEDULE */}
        {currentTab === 'schedule' && (
          <View style={styles.section}>
            <Text style={styles.screenTitle}>Weekly Work Schedule</Text>
            <Text style={styles.paragraphMuted}>
              Assigned floor supervision and personal training slots.
            </Text>

            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <View key={day} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleMedium}>{day}</Text>
                  <Text style={styles.badgeSilver}>05:30 AM - 01:30 PM</Text>
                </View>
                <Text style={styles.paragraphMuted}>
                  Morning Floor Supervision &amp; Powerlifting Coaching
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 5: PROFILE */}
        {currentTab === 'profile' && (
          <View style={styles.section}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardHeader}>EMPLOYEE DETAILS</Text>
              <Text style={styles.titleLarge}>Vikram Rathore</Text>
              <Text style={styles.paragraphMuted}>
                Email: vikram@parshuramgym.com{'\n'}
                Designation: Senior Strength Coach{'\n'}
                Joining Date: 2025-03-01{'\n'}
                Emergency Contact: Recorded on file
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>GYM POLICIES</Text>
              <Text style={styles.paragraphMuted}>
                • All leave requests must be submitted at least 24 hours in advance.{'\n'}
                • Shift attendance clock-in must occur at the entrance terminal.{'\n'}
                • Any emergency shifts must be coordinated with Dave.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentTab('dashboard')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'dashboard' && styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('attendance')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'attendance' && styles.navTextActive]}>Shift Log</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('leaves')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'leaves' && styles.navTextActive]}>Leaves</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('schedule')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'schedule' && styles.navTextActive]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('profile')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Leave Application Modal */}
      <Modal visible={leaveModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.titleMedium}>Apply For Leave</Text>
              <TouchableOpacity onPress={() => setLeaveModalOpen(false)}>
                <Text style={styles.textRed}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 15 }}>
              <Text style={styles.textSilver}>Start Date (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={[styles.textSilver, { marginTop: 10 }]}>End Date (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
              />

              <Text style={[styles.textSilver, { marginTop: 10 }]}>Substantive Reason:</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                multiline
                placeholder="Enter detailed reason for Dave..."
                placeholderTextColor="#777"
                value={reason}
                onChangeText={setReason}
              />

              {leaveFeedback && (
                <Text style={[styles.textRed, { marginVertical: 8 }]}>{leaveFeedback}</Text>
              )}

              <TouchableOpacity onPress={handleApplyLeave} style={styles.btnRed}>
                <Text style={styles.btnText}>Submit Request to Dave</Text>
              </TouchableOpacity>
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
    color: '#C0C0C0',
    fontSize: 9,
    fontWeight: '600'
  },
  headerActionBtn: {
    backgroundColor: '#E02025',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  headerActionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80
  },
  section: {
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
  btnGreen: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
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
    marginTop: 6
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
  noteBox: {
    backgroundColor: '#171717',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 6
  },
  noteText: {
    color: '#C0C0C0',
    fontSize: 11,
    fontStyle: 'italic'
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
  }
});
