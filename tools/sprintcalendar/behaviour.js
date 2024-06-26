
// -------------------------------------------------------------
function stringIncrement(string) {
    let chunks = string.split('.')
    let lastChunk = chunks[chunks.length - 1]
    const lastChunkLen = lastChunk.length

    // try incrementing the last chunk
    lastChunk = '' + (parseInt(lastChunk,10) + 1)

    // pad last chunk to its original length
    while (lastChunk.length < lastChunkLen) {
        lastChunk = '0' + lastChunk
    }

    // put chunks back together
    chunks[chunks.length - 1] = lastChunk
    return chunks.join('.')
}
// -------------------------------------------------------------
function makeDayCell(date, above, left, formats) {
    const content = date.toLocaleString('en-AU', { weekday: 'long', day: 'numeric' })
    let [wDay, mDate] = content.split(' ')

    wDay = wDay.substring(0, formats.dayFormat)

    // work out what special classes to add
    let classes = []
    // is the day above from a different month?
    if (above.getMonth() !== date.getMonth()) {
        classes.push('differentAbove')
    }
    // is the day left of us from a different month?
    if (left.getMonth() !== date.getMonth()) {
        classes.push('differentLeft')
    }
    // is it a weekend?
    if (date.getDay() === 0 || date.getDay() === 6) {
        classes.push('weekend')
    }
    // should we add space?
    if (formats.addSpace) {
        classes.push('space')
    }

    return [
        '<td class="' + classes.join(' ') + '">',
            '<span class="dayName">',
                wDay,
                formats.bigDates ? '' : mDate,
            '</span>',
            '<span class="monthDate">',
            formats.bigDates ? mDate : '',
            '</span>',
        '</td>'
    ].join(' ')
}
// -------------------------------------------------------------
function makeMonthCell(date, length, formats) {
    let above = new Date(date)
    above.setDate(date.getDate() - length)

    // work out what special classes to add. start with "month"
    let classes = ['month']
    // is the day above our same month?
    if (above.getMonth() !== date.getMonth()) {
        classes.push('differentAbove')
    }
    // should we add space?
    if (formats.addSpace) {
        classes.push('space')
    }

    const content = date.toLocaleString('en-AU', {month: 'long'}).substring(0, formats.monthFormat)
    return '<td class="' + classes.join(' ') + '">' + content + '</td>'
}
// -------------------------------------------------------------
function makeTextCell(text, formats) {
    // work out what special classes to add
    let classes = []
    // should we add space?
    if (formats.addSpace) {
        classes.push('space')
    }

    return '<td class="' + classes.join(' ') + '">' + text + '</td>'
}
// -------------------------------------------------------------
function updateSummary(firstDay, length, calendarLength, formats) {
    let summary = [
        'Calendar of',
        calendarLength,
        'sprints of',
        length,
        'days each, starting on',
        firstDay.toLocaleDateString('en-AU', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    ].join(' ')
    document.querySelector('.summary').textContent = summary
}
// -------------------------------------------------------------
function makeSprintRow(firstDay, length, name, formats) {
    const row = []
    row.push(makeTextCell(name, formats))
    row.push(makeMonthCell(firstDay, length, formats))
    const lastDay = new Date(firstDay)
    lastDay.setDate(firstDay.getDate() + length)

    let daysToGo = length
    let day = new Date(firstDay)
    let left, above
    day.setDate(day.getDate() - 1)
    while (daysToGo > 0) {
        day.setDate(day.getDate() + 1)

        left = new Date(day)
        left.setDate(day.getDate() - 1)

        above = new Date(day)
        above.setDate(day.getDate() - length)
        daysToGo -= 1

        row.push(makeDayCell(day, above, left, formats))
    }
    row.push(makeMonthCell(day, length, formats))
    row.push(makeTextCell(name, formats))

    return '<tr>' + row.join('\n') + '</tr>'
}
// -------------------------------------------------------------
function makeCalendar() {
    const tableBody = document.querySelector('table.calendar tbody')

    const firstDay = new Date(document.getElementById('sprintStart').value)
    const length = parseInt(document.getElementById('sprintLength').value, 10)
    const calendarLength = parseInt(document.getElementById('calendarLength').value, 10)
    let name = document.getElementById('sprintName').value

    const formats = {
        monthFormat: document.getElementById('monthNameFormat').value,
        dayFormat: document.getElementById('dayNameFormat').value,
        bigDates: document.getElementById('bigDates').checked,
        addSpace: document.getElementById('addSpace').checked
    }

    updateSummary(firstDay, length, calendarLength, formats)

    let sprints = []

    for (let sprint=0; sprint < calendarLength; sprint++) {
        sprints.push(makeSprintRow(firstDay, length, name, formats))
        firstDay.setDate(firstDay.getDate() + length)
        name = stringIncrement(name)
    }
    tableBody.innerHTML = sprints.join('\n')
}
// -------------------------------------------------------------
// -------------------------------------------------------------
// attach handler to button
const goButton = document.getElementById('makeCalendar')
if (goButton) {
    goButton.addEventListener('click', function(e) {
        makeCalendar()
        e.preventDefault()
        return false
    })
}

document.querySelectorAll('input, select').forEach(
    el => el.addEventListener('change', makeCalendar)
)

makeCalendar()
