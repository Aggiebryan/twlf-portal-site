const activity = {
  calendar: document.querySelector('#calendarList'),
  mail: document.querySelector('#mailList'),
  updated: document.querySelector('#activityUpdated'),
  refresh: document.querySelector('#activityRefresh'),
  signIn: document.querySelector('#activitySignIn'),
  calendarCount: document.querySelector('#calendarCount'),
};

const moduleEscape = value => {
  const node = document.createElement('div');
  node.textContent = value || '';
  return node.innerHTML;
};

const graphDate = value => {
  const dateTime = value?.dateTime || '';
  return new Date(value?.timeZone === 'UTC' && !/[zZ]|[+-]\d\d:\d\d$/.test(dateTime) ? `${dateTime}Z` : dateTime);
};

const dayLabel = date => new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
const timeLabel = date => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
const messageTime = date => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);

const moduleEnabled = () => window.twlfModuleState?.microsoft365 !== false;

function setModuleLoading() {
  activity.refresh.classList.add('spinning');
  activity.calendar.innerHTML = '<div class="activity-empty">Loading calendar…</div>';
  activity.mail.innerHTML = '<div class="activity-empty">Loading email…</div>';
}

function renderCalendar(events) {
  activity.calendarCount.textContent = events.length;
  activity.calendar.innerHTML = events.length ? events.map(event => {
    const start = graphDate(event.start), end = graphDate(event.end);
    const when = event.isAllDay ? `${dayLabel(start)} · All day` : `${dayLabel(start)} · ${timeLabel(start)}–${timeLabel(end)}`;
    const location = event.location?.displayName ? `<small>${moduleEscape(event.location.displayName)}</small>` : '';
    return `<a class="calendar-item" href="${moduleEscape(event.webLink)}" target="_blank" rel="noreferrer"><span class="event-date">${moduleEscape(when)}</span><strong>${moduleEscape(event.subject || '(No title)')}</strong>${location}</a>`;
  }).join('') : '<div class="activity-empty">No upcoming events in the next 30 days.</div>';
}

function renderMail(messages) {
  activity.mail.innerHTML = messages.length ? messages.map(message => {
    const sender = message.from?.emailAddress?.name || message.from?.emailAddress?.address || 'Unknown sender';
    return `<a class="mail-item ${message.isRead ? '' : 'unread'}" href="${moduleEscape(message.webLink)}" target="_blank" rel="noreferrer"><span><strong>${moduleEscape(sender)}</strong><time>${moduleEscape(messageTime(new Date(message.receivedDateTime)))}</time></span><p>${moduleEscape(message.subject || '(No subject)')}</p></a>`;
  }).join('') : '<div class="activity-empty">No recent email found.</div>';
}

async function graphRequest(path, token) {
  const response = await fetch(`https://graph.microsoft.com/v1.0${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error?.message || `Microsoft Graph returned ${response.status}.`);
  }
  return response.json();
}

async function refreshActivity() {
  if (!window.twlfAuth.getAccount()) {
    activity.signIn.hidden = false;
    activity.updated.textContent = 'Sign in to connect';
    return;
  }
  activity.signIn.hidden = true;
  setModuleLoading();
  try {
    const tokenResponse = await window.twlfAuth.acquireGraphToken(['Calendars.Read', 'Mail.ReadBasic']);
    if (!tokenResponse) return;
    const now = new Date(), end = new Date(now.getTime() + 30 * 86400000);
    const calendarPath = `/me/calendarView?startDateTime=${encodeURIComponent(now.toISOString())}&endDateTime=${encodeURIComponent(end.toISOString())}&$select=subject,start,end,location,isAllDay,webLink&$orderby=start/dateTime&$top=10`;
    const mailPath = '/me/messages?$select=subject,from,receivedDateTime,isRead,webLink&$orderby=receivedDateTime%20desc&$top=10';
    const [calendar, mail] = await Promise.all([graphRequest(calendarPath, tokenResponse.accessToken), graphRequest(mailPath, tokenResponse.accessToken)]);
    renderCalendar(calendar.value || []);
    renderMail(mail.value || []);
    activity.updated.textContent = `Updated ${timeLabel(new Date())}`;
  } catch (error) {
    const message = moduleEscape(error.message || 'Microsoft 365 data could not be loaded.');
    activity.calendar.innerHTML = `<div class="activity-error">${message}</div>`;
    activity.mail.innerHTML = `<div class="activity-error">${message}</div>`;
    activity.updated.textContent = 'Unable to refresh';
  } finally {
    activity.refresh.classList.remove('spinning');
  }
}

activity.refresh.addEventListener('click', refreshActivity);
activity.signIn.addEventListener('click', () => window.twlfAuth.signIn());
window.twlfAuth.ready.then(() => { if (moduleEnabled()) refreshActivity(); });
// Re-run when the user switches the module back on.
document.addEventListener('twlf:modules', event => { if (event.detail?.microsoft365 !== false) refreshActivity(); });
setInterval(() => { if (!document.hidden) refreshActivity(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshActivity(); });
