import dayjs, { Dayjs } from 'dayjs'

export function formatTime(date: any, pattern = 'YYYY-MM-DD') {
  if (date) {
    return dayjs(date).format(pattern)
  } else {
    return date
  }
}

export function formatLabel(labels: any[]) {
  if (!labels || labels.length === 0) {
    return '--'
  }
  return labels.map((item) => item.name).join(',')
}

export function formatWeek(date: Dayjs) {
  const dayOfWeek = dayjs(date).get('day')
  if (dayOfWeek === 0) {
    // 如果是周日，格式化要另算
    return `${dayjs(date).subtract(6, 'days').format('YYYY-MM-DD')}~~${dayjs(
      date
    ).format('YYYY-MM-DD')}`
  } else {
    return `${dayjs(date)
      .startOf('week')
      .add(1, 'days')
      .format('YYYY-MM-DD')}~~${dayjs(date)
      .endOf('week')
      .add(1, 'days')
      .format('YYYY-MM-DD')}`
  }
}

export function formatMembers(members: any[] = []) {
  return members.map((item) => item.name).join(',')
}
