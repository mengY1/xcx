  //封装时间格式
  function changeTime(time,end,start) {
    end = end?end:11
    start = start?start:0
    var time2 = time.replace(/-/g, '/').slice(start, end)
    return time2;
  }
  export default changeTime;
  //数组转时间格式
  export function toTime(arr) {
    var year = arr[0].toString().length==1?"200" + arr[0]:"20" + arr[0]
    var month = arr[1]+1
    month = month.toString().length==1?'0'+month:month
    var day = arr[2] + 1
    day = day.toString().length==1?'0'+day:day
    var hour = arr[3]
    hour = hour.toString().length==1?'0'+hour:hour
    var minute = arr[4]
    minute = minute.toString().length==1?'0'+minute:minute
    var date = year + "-" + month + "-" + day + " " + hour + ":" + minute
    return date
  }
