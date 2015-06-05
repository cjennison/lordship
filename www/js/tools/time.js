function convertTimeTo12HourClock(time, formatted){
  if(formatted){
    if(time > 12) return (time - 12) + ":00 PM";
    else return (time) + ":00 AM";;
  }

  if(time > 12) return time - 12
  else return time;
}