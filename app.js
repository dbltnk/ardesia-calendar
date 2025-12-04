function calendarApp() {
    const now = new Date();
    const initialMonth = now.getMonth();
    const initialYear = now.getFullYear();
    
    return {
        // Calendar state
        currentMonth: initialMonth,
        currentYear: initialYear,
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
        calendarDays: [],
        
        // Event data
        events: [],
        
        // Password modal
        passwordModal: {
            show: false,
            event: null,
            input: '',
            error: ''
        },
        
        // Subscription
        subscribeEmail: '',
        subscribeSuccess: false,
        subscribeMinimized: false,
        
        // Steam wishlist
        steamMinimized: false,
        
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
                
                // Explicitly set values to force Alpine to update the select elements
                this.currentMonth = month;
                this.currentYear = year;
                
                // Manually set select element values as fallback
                this.$nextTick(() => {
                    this.syncSelectElements(month, year);
                });
            }, 50);
        },
        
        loadSampleEvents() {
            const today = new Date();
            const currentDate = today.getDate();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            // Sample events themed around Vincent Brandt (audio engineer)
            this.events = [
                {
                    id: 1,
                    date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 5)),
                    name: 'Audio Restoration Session',
                    startTime: '09:00',
                    endTime: '12:00',
                    state: 'locked',
                    password: 'password',
                    content: 'Restoring audio from a 1980s music recording. Client: Independent filmmaker working on a documentary about the local music scene.',
                    media: {
                        audio: true
                    },
                    attendee: 'Claudia'
                },
                {
                    id: 2,
                    date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 3)),
                    name: 'Forensic Audio Analysis',
                    startTime: '14:00',
                    endTime: '16:30',
                    state: 'locked',
                    password: 'password',
                    content: 'Analyzing audio evidence for a legal case. Need to isolate background conversations and enhance clarity.',
                    media: {
                        audio: true
                    }
                },
                {
                    id: 3,
                    date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 1)),
                    name: 'Historical Recording Digitization',
                    startTime: '10:00',
                    endTime: '11:30',
                    state: 'greyed',
                    password: 'password',
                    content: 'Digitizing tape recordings from the 1970s. These are personal recordings from a client\'s family archive.',
                    media: {
                        audio: true
                    }
                },
                {
                    id: 4,
                    date: new Date(currentYear, currentMonth, currentDate),
                    name: 'Movie Set Audio Review',
                    startTime: '13:00',
                    endTime: '15:00',
                    state: 'locked',
                    password: 'password',
                    content: 'Reviewing audio tracks from a recent film production. Checking for inconsistencies and background noise.',
                    media: {
                        video: true,
                        audio: true
                    },
                    attendee: 'Mike'
                },
                {
                    id: 5,
                    date: new Date(currentYear, currentMonth, Math.min(28, currentDate + 2)),
                    name: 'Music Restoration Project',
                    startTime: '09:30',
                    endTime: '13:00',
                    state: 'locked',
                    password: 'password',
                    content: 'Working on restoring a rare jazz recording from the 1960s. The tape shows signs of degradation - need to carefully remove hiss and restore frequency response.',
                    media: {
                        audio: true,
                        image: true
                    }
                },
                {
                    id: 6,
                    date: new Date(currentYear, currentMonth, Math.min(28, currentDate + 5)),
                    name: 'Client Meeting - Viola Project',
                    startTime: '15:00',
                    endTime: '16:00',
                    state: 'unlocked',
                    password: 'password',
                    content: 'Discussion about Viola\'s audio restoration work. There\'s something intriguing about this project - the recordings seem to tell a story beyond just the audio quality.',
                    media: {
                        audio: true
                    },
                    attendee: 'Claudia'
                },
                {
                    id: 7,
                    date: new Date(currentYear, currentMonth, Math.min(28, currentDate + 8)),
                    name: 'Tape Degradation Research',
                    startTime: '11:00',
                    endTime: '12:00',
                    state: 'locked',
                    password: 'password',
                    content: 'Documenting degradation patterns in various tape formats. This knowledge comes from years of experience with the medium.',
                    media: {
                        image: true
                    }
                },
                {
                    id: 8,
                    date: new Date(currentYear, currentMonth + 1, 5),
                    name: 'Archive Organization',
                    startTime: '10:00',
                    endTime: '14:00',
                    state: 'greyed',
                    password: 'password',
                    content: 'Organizing old project files. Some of these date back to when I first moved to Munich.',
                    media: null
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
                this.calendarDays.push({
                    date: date,
                    otherMonth: true,
                    isToday: false,
                    year: prevMonth.getFullYear(),
                    month: prevMonth.getMonth(),
                    event: null
                });
            }
            
            // Current month days
            for (let date = 1; date <= daysInMonth; date++) {
                const isToday = isCurrentMonth && date === today.getDate();
                const event = this.getEventForDate(date, month, year);
                
                this.calendarDays.push({
                    date: date,
                    otherMonth: false,
                    isToday: isToday,
                    year: year,
                    month: month,
                    event: event
                });
            }
            
            // Next month days to fill the grid - ensure exactly 42 days (6 rows)
            const totalDaysNeeded = 42; // 6 rows * 7 days
            const remainingDays = totalDaysNeeded - this.calendarDays.length;
            if (remainingDays > 0) {
                for (let date = 1; date <= remainingDays; date++) {
                    const nextMonth = new Date(year, month + 1, date);
                    this.calendarDays.push({
                        date: date,
                        otherMonth: true,
                        isToday: false,
                        year: nextMonth.getFullYear(),
                        month: nextMonth.getMonth(),
                        event: null
                    });
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
            const startMinutes = this.parseTimeToMinutes(event.startTime);
            const endMinutes = this.parseTimeToMinutes(event.endTime);
            const duration = endMinutes - startMinutes;
            
            // Day is 1440 minutes (24 hours)
            // Calculate positioning based on percentage of day
            const topPercent = (startMinutes / 1440) * 100;
            const heightPercent = (duration / 1440) * 100;
            
            // Ensure minimum height for visibility (at least 20% of cell height)
            const minHeightPercent = 20;
            const calculatedHeightPercent = Math.max(minHeightPercent, heightPercent);
            
            // Ensure the event doesn't overflow the bottom of the cell
            // If top + height would exceed 100%, reduce the height
            const maxAllowedHeight = 100 - topPercent;
            const finalHeightPercent = Math.min(calculatedHeightPercent, maxAllowedHeight);
            
            // Set minimum top offset to ensure consistent spacing below day-number
            // Day-number is approximately 18px (14px font + 4px margin-bottom) + 8px padding = ~26px
            // Use 10% as minimum offset (approximately 30-40px in typical cells) to ensure consistent spacing
            // This ensures all events have the same spacing from the date number
            const minTopPercent = 10;
            const finalTopPercent = Math.max(minTopPercent, topPercent);
            
            // Use fixed height for all events to ensure single-line text display
            // All events should have consistent height based on duration, constrained to cell
            const style = {
                top: `${finalTopPercent}%`,
                height: `${finalHeightPercent}%`,
                maxHeight: `${maxAllowedHeight}%`
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
                this.passwordModal.event.state = 'unlocked';
                this.closePasswordModal();
            } else {
                this.passwordModal.error = 'Incorrect password. Try again.';
                this.passwordModal.input = '';
            }
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

