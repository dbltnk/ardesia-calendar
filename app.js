function calendarApp() {
    const now = new Date();
    const initialMonth = now.getMonth();
    const initialYear = now.getFullYear();
    
    return {
        // User info
        user: {
            name: 'Vincent Brandt',
            email: 'vincent@audiovan.com',
            initials: 'VB',
            role: 'Audio Engineer'
        },
        
        // Calendar state
        currentMonth: initialMonth,
        currentYear: initialYear,
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
        calendarDays: [],
        
        // Event data
        events: [],
        
        // User menu
        showUserMenu: false,
        
        // Password modal
        passwordModal: {
            show: false,
            event: null,
            input: '',
            error: ''
        },
        
        // Event popover
        eventPopover: {
            show: false,
            event: null
        },
        
        // Subscription
        subscribeEmail: '',
        subscribeSuccess: false,
        subscribeMinimized: false,
        
        // Steam wishlist
        steamMinimized: false,
        
        // Constants
        DEFAULT_PASSWORD: 'password',
        
        handleEventClick(event) {
            if (event.state === 'greyed') return;
            if (event.state === 'locked') {
                this.openPasswordModal(event);
            } else {
                this.openEventPopover(event);
            }
        },
        
        createDayObject(date, otherMonth, isToday, year, month, event = null) {
            return {
                date,
                otherMonth,
                isToday,
                year,
                month,
                event
            };
        },
        
        syncSelectElements(month, year) {
            const monthSelect = document.querySelector('.month-select');
            const yearSelect = document.querySelector('.year-select');
            
            if (monthSelect && monthSelect.value !== String(month)) {
                monthSelect.value = String(month);
                monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (yearSelect && yearSelect.value !== String(year)) {
                yearSelect.value = String(year);
                yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        
        init() {
            this.loadSampleEvents();
            this.updateCalendar();
            
            // Force select elements to sync after DOM is ready
            // This ensures the select options are rendered before we try to set values
            setTimeout(() => {
                const month = Number(this.currentMonth);
                const year = Number(this.currentYear);
                
                // Manually set select element values as fallback
                this.$nextTick(() => {
                    this.syncSelectElements(month, year);
                });
            }, 50);
        },
        
        loadSampleEvents() {
            // All events in December 2025
            const year = 2025;
            const month = 11; // December (0-indexed)
            
            // First third of December (1-10): 4 unlocked events
            // Middle third (11-20): 3 locked events
            // Last third (21-31): 3 greyed out events
            this.events = [
                // First third - Unlocked events (Dec 2, 4, 6, 8)
                {
                    id: 1,
                    date: new Date(year, month, 2),
                    name: 'Client Meeting - Viola Project',
                    startTime: '15:00',
                    endTime: '16:00',
                    state: 'unlocked',
                    password: 'password',
                    content: 'Discussion about Viola\'s audio restoration work. There\'s something intriguing about this project - the recordings seem to tell a story beyond just the audio quality. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    media: {
                        audio: true
                    },
                    participant: 'Mike'
                },
                {
                    id: 2,
                    date: new Date(year, month, 4),
                    name: 'Studio Equipment Documentation',
                    startTime: '10:00',
                    endTime: '11:30',
                    state: 'unlocked',
                    password: 'password',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                    media: {
                        image: true
                    },
                    participant: 'Pavel'
                },
                {
                    id: 3,
                    date: new Date(year, month, 6),
                    name: 'Film Audio Post-Production Review',
                    startTime: '14:00',
                    endTime: '17:00',
                    state: 'unlocked',
                    password: 'password',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    media: {
                        video: true,
                        audio: true
                    },
                    participant: 'Mike'
                },
                {
                    id: 4,
                    date: new Date(year, month, 8),
                    name: 'Podcast Audio Editing Session',
                    startTime: '09:00',
                    endTime: '12:30',
                    state: 'unlocked',
                    password: 'password',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                    media: {
                        audio: true
                    },
                    participant: 'Claudia L.'
                },
                // Middle third - Locked events (Dec 12, 15, 18)
                {
                    id: 5,
                    date: new Date(year, month, 12),
                    name: 'Audio Restoration Session',
                    startTime: '09:00',
                    endTime: '12:00',
                    state: 'locked',
                    password: 'password',
                    content: 'Restoring audio from a 1980s music recording. Client: Independent filmmaker working on a documentary about the local music scene. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    media: {
                        audio: true
                    },
                    participant: 'Mike'
                },
                {
                    id: 6,
                    date: new Date(year, month, 15),
                    name: 'Forensic Audio Analysis',
                    startTime: '14:00',
                    endTime: '16:30',
                    state: 'locked',
                    password: 'password',
                    content: 'Analyzing audio evidence for a legal case. Need to isolate background conversations and enhance clarity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    media: {
                        audio: true
                    },
                    participant: 'Pavel'
                },
                {
                    id: 7,
                    date: new Date(year, month, 18),
                    name: 'Movie Set Audio Review',
                    startTime: '13:00',
                    endTime: '15:00',
                    state: 'locked',
                    password: 'password',
                    content: 'Reviewing audio tracks from a recent film production. Checking for inconsistencies and background noise. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.',
                    media: {
                        video: true,
                        audio: true
                    },
                    participant: 'Mike'
                },
                // Last third - Greyed out events (Dec 23, 28, 30)
                {
                    id: 8,
                    date: new Date(year, month, 23),
                    name: 'Historical Recording Digitization',
                    startTime: '10:00',
                    endTime: '11:30',
                    state: 'greyed',
                    password: 'password',
                    content: 'Digitizing tape recordings from the 1970s. These are personal recordings from a client\'s family archive. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    media: {
                        audio: true
                    }
                },
                {
                    id: 9,
                    date: new Date(year, month, 28),
                    name: 'Archive Organization',
                    startTime: '10:00',
                    endTime: '14:00',
                    state: 'greyed',
                    password: 'password',
                    content: 'Organizing old project files. Some of these date back to when I first moved to Munich. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
                    media: null
                },
                {
                    id: 10,
                    date: new Date(year, month, 30),
                    name: 'End of Year Review',
                    startTime: '14:00',
                    endTime: '16:00',
                    state: 'greyed',
                    password: 'password',
                    content: 'Reviewing all projects from the past year. Preparing summaries and documentation for client archives. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    media: {
                        image: true
                    }
                }
            ];
        },
        
        updateCalendar() {
            // Ensure values are numbers
            const month = Number(this.currentMonth);
            const year = Number(this.currentYear);
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();
            
            const today = new Date();
            const isCurrentMonth = month === today.getMonth() && 
                                  year === today.getFullYear();
            
            this.calendarDays = [];
            
            // Previous month days
            const prevMonth = new Date(year, month, 0);
            const daysInPrevMonth = prevMonth.getDate();
            for (let i = startingDayOfWeek - 1; i >= 0; i--) {
                const date = daysInPrevMonth - i;
                this.calendarDays.push(
                    this.createDayObject(date, true, false, prevMonth.getFullYear(), prevMonth.getMonth())
                );
            }
            
            // Current month days
            for (let date = 1; date <= daysInMonth; date++) {
                const isToday = isCurrentMonth && date === today.getDate();
                const event = this.getEventForDate(date, month, year);
                this.calendarDays.push(
                    this.createDayObject(date, false, isToday, year, month, event)
                );
            }
            
            // Next month days to fill the grid - ensure exactly 42 days (6 rows)
            const totalDaysNeeded = 42; // 6 rows * 7 days
            const remainingDays = totalDaysNeeded - this.calendarDays.length;
            if (remainingDays > 0) {
                for (let date = 1; date <= remainingDays; date++) {
                    const nextMonth = new Date(year, month + 1, date);
                    this.calendarDays.push(
                        this.createDayObject(date, true, false, nextMonth.getFullYear(), nextMonth.getMonth())
                    );
                }
            }
            
            // Ensure we have exactly 42 days (trim if somehow we have more)
            if (this.calendarDays.length > totalDaysNeeded) {
                this.calendarDays = this.calendarDays.slice(0, totalDaysNeeded);
            }
        },
        
        getEventForDate(date, month, year) {
            // Only return the first event found for this date (ensures one event per day)
            return this.events.find(event => {
                const eventDate = event.date;
                return eventDate.getDate() === date &&
                       eventDate.getMonth() === month &&
                       eventDate.getFullYear() === year;
            }) || null;
        },
        
        changeMonth(direction) {
            if (direction === 'prev') {
                if (this.currentMonth === 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                } else {
                    this.currentMonth--;
                }
            } else {
                if (this.currentMonth === 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                } else {
                    this.currentMonth++;
                }
            }
            this.updateCalendar();
        },
        
        previousMonth() {
            this.changeMonth('prev');
        },
        
        nextMonth() {
            this.changeMonth('next');
        },
        
        goToToday() {
            const today = new Date();
            this.currentMonth = today.getMonth();
            this.currentYear = today.getFullYear();
            this.updateCalendar();
        },
        
        isYearActive(year) {
            return year >= 2025 && year <= 2027;
        },
        
        formatEventTime(event) {
            return `${event.startTime} - ${event.endTime}`;
        },
        
        parseTimeToMinutes(timeString) {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        },
        
        getEventStyle(event) {
            // All events start at the same Y position
            // Set fixed top offset to ensure consistent spacing below day-number
            // Day-number is approximately 18px (14px font + 4px margin-bottom) + 8px padding = ~26px
            // Use 10% as fixed offset (approximately 30-40px in typical cells) to ensure consistent spacing
            const topPercent = 35;
            
            // Use fixed height for all events to ensure single-line text display
            const style = {
                top: `${topPercent}%`,
                height: 'auto',
                maxHeight: `calc(100% - ${topPercent}%)`
            };
            
            return style;
        },
        resetPasswordModal() {
            this.passwordModal.input = '';
            this.passwordModal.error = '';
        },
        
        openPasswordModal(event) {
            this.passwordModal.show = true;
            this.passwordModal.event = event;
            this.resetPasswordModal();
        },
        
        closePasswordModal() {
            this.passwordModal.show = false;
            this.passwordModal.event = null;
            this.resetPasswordModal();
        },
        
        checkPassword() {
            if (!this.passwordModal.event) return;
            
            if (this.passwordModal.input === this.passwordModal.event.password) {
                // Unlock the event
                const unlockedEvent = this.passwordModal.event;
                unlockedEvent.state = 'unlocked';
                this.closePasswordModal();
                // Show popover after unlocking
                this.openEventPopover(unlockedEvent);
            } else {
                this.passwordModal.error = 'Incorrect password. Try again.';
                this.passwordModal.input = '';
            }
        },
        
        openEventPopover(event) {
            this.eventPopover.show = true;
            this.eventPopover.event = event;
        },
        
        closeEventPopover() {
            this.eventPopover.show = false;
            this.eventPopover.event = null;
        },
        
        formatEventDate(event) {
            const date = event.date;
            const monthNames = this.months;
            return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        },
        
        handleSubscribe() {
            if (this.subscribeEmail.trim() === '') {
                return;
            }
            
            // Simulate subscription
            this.subscribeSuccess = true;
            this.subscribeEmail = '';
            this.subscribeMinimized = true;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                this.subscribeSuccess = false;
            }, 5000);
        },
        
        get availableYears() {
            const years = [];
            const currentYear = new Date().getFullYear();
            for (let year = currentYear - 2; year <= currentYear + 5; year++) {
                years.push(year);
            }
            return years;
        }
    };
}

