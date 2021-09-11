module.exports.date=getdate();

function getdate(){
  let today= new Date();
  let options={
    weekday:"long",
    day:"numeric",
    month:"long"
  }
  let date=today.toLocaleDateString("en-US",options);
  return date;
}

module.exports.day=function(){
  let today= new Date();
  let options={
    weekday:"long"
  }
  let day=today.toLocaleDateString("en-US",options);
  return day;
}
