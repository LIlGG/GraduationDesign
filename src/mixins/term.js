import wepy from 'wepy'
import db from '../util/db'
export default class TermMixin extends wepy.mixin {
  data = {
    term: {}
  }
  // 计算周次
  GetWeek(year, month, day) {
    const start = new Date(this.term.startTime)
    const end = new Date(this.term.endTime)
    const current = new Date(year, month - 1, day, 23, 59, 59)
    if (current.getTime() < start.getTime() || current.getTime() > end.getTime()) {
      return 0
    }
    return Math.floor((current.getTime() - start.getTime()) / 1000 / 3600 / 24 / 7) + 1
  }
  // 根据周次计算时间
  GetDate(week) {
    let start = new Date(this.term.startTime)
    start.setDate(start.getDate() + (week - 1) * 7)
    return start
  }
  async GetTerm() {
    const resp = await this.GET('/term')
    this.term = resp.data
    this.$apply()
    db.Set('term', resp.data)
    db.Set('updateTime.term', new Date().getTime())
  }
  async InitTerm(cacheTime = 6) {
    const now = (new Date()).getTime()
    const updateTime = db.Get('updateTime.term') || 0
    if ((now - updateTime) / 1000 / 3600 < cacheTime && db.Get('term')) {
      this.term = db.Get('term')
      this.$apply()
    } else {
      await this.GetTerm()
    }
  }
}
