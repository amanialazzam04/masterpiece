"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const localDate = date => [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-");
  const dayOffset = offset => { const date=new Date(now); date.setDate(date.getDate()+offset); return localDate(date); };
  const clients=[
    {id:"demo-client-a",name:"Demo Client A",reference:"SAMPLE-01",status:"connected",connectionLabel:"Connected \u00b7 fictional permission preview",lastSession:dayOffset(-1),goals:["Build a sustainable evening routine","Practice naming personal support preferences"],followup:"Revisit the client-selected evening routine goal at the next session.",moodShared:true,moodSummary:"Sixteen fictional mood check-ins were explicitly marked shared in this sample record this week.",history:[{date:dayOffset(-1),label:"Individual check-in",status:"completed",summary:"Reviewed the client's self-selected routine goal."},{date:dayOffset(-8),label:"Initial planning session",status:"completed",summary:"Agreed on a small, client-led next step."}]},
    {id:"demo-client-b",name:"Demo Client B",reference:"SAMPLE-02",status:"pending",connectionLabel:"Pending \u00b7 fictional sample",lastSession:"",goals:[],followup:"No authorized follow-up information is available for this sample profile.",moodShared:false,moodSummary:"No mood summary is authorized in this fictional sample profile.",history:[]}
  ];
  const sessions=[
    {id:"session-1",clientId:"demo-client-a",date:dayOffset(0),time:"10:30",label:"Individual check-in",status:"scheduled",format:"Online \u00b7 sample"},{id:"session-2",clientId:"demo-client-a",date:dayOffset(1),time:"14:00",label:"Goal review",status:"scheduled",format:"Online \u00b7 sample"},{id:"session-3",clientId:"demo-client-a",date:dayOffset(-1),time:"11:00",label:"Individual check-in",status:"completed",format:"Online \u00b7 sample"},{id:"session-5",clientId:"demo-client-a",date:dayOffset(-8),time:"09:30",label:"Initial planning session",status:"completed",format:"Online \u00b7 sample"},{id:"session-4",clientId:"demo-client-b",date:dayOffset(0),time:"15:00",label:"Introductory conversation",status:"cancelled",format:"Sample request"}
  ];
  const requests=[{id:"request-1",clientId:"demo-client-b",date:dayOffset(2),topic:"Discussing support options",status:"pending",message:"Fictional sample request. No personal details are included."}];
  const tasks=[{id:"task-1",clientId:"demo-client-a",title:"Review the agreed routine goal",due:dayOffset(0),priority:"Routine",status:"open"},{id:"task-2",clientId:"demo-client-a",title:"Prepare a short session check-in",due:dayOffset(1),priority:"Routine",status:"open"}];
  const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
  const getClient=id=>clients.find(client=>client.id===id);
  const clientName=id=>getClient(id)?.name||"Fictional sample client";
  const prettyDate=value=>new Date(value+"T12:00:00").toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"});
  const weekday=value=>new Date(value+"T12:00:00").toLocaleDateString("en",{weekday:"short"});
  const setStatus=status=>element("span","th-status "+status.replaceAll(" ","-"),status);
  function renderDashboard(){
    const targets={clients:document.getElementById("summary-active-clients"),sessions:document.getElementById("summary-today-sessions"),requests:document.getElementById("summary-pending-requests"),tasks:document.getElementById("summary-followups")};
    if(!targets.clients)return;
    targets.clients.textContent=String(clients.filter(c=>c.status==="connected").length);targets.sessions.textContent=String(sessions.filter(s=>s.date===dayOffset(0)&&s.status==="scheduled").length);targets.requests.textContent=String(requests.filter(r=>r.status==="pending").length);targets.tasks.textContent=String(tasks.filter(t=>t.status==="open").length);
    const upcoming=document.getElementById("dashboard-upcoming");upcoming.replaceChildren();const list=sessions.filter(s=>s.status==="scheduled"&&s.date>=dayOffset(0)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    if(!list.length)upcoming.appendChild(element("p","empty-state compact-empty","No upcoming sample sessions."));
    list.slice(0,3).forEach(session=>{const item=element("div","th-compact-item"),date=element("span","th-compact-date",weekday(session.date)+"\n"+session.time),copy=element("div");copy.append(element("strong","",clientName(session.clientId)),element("small","",session.label+" \u00b7 fictional"));item.append(date,copy,setStatus(session.status));upcoming.appendChild(item);});
    const activity=document.getElementById("dashboard-activity");activity.replaceChildren();[["DEMO","Client goal reviewed",clientName("demo-client-a")+" \u00b7 fictional sample"],["TASK","Follow-up tasks ready",tasks.filter(t=>t.status==="open").length+" open in this sample"]].forEach(row=>{const item=element("div","th-compact-item"),copy=element("div");item.append(element("span","th-compact-date",row[0]),copy);copy.append(element("strong","",row[1]),element("small","",row[2]));item.appendChild(setStatus("demo only"));activity.appendChild(item);});
  }
  window.TherapistDemo={clients,sessions,requests,tasks,element,getClient,clientName,prettyDate,weekday,dayOffset,setStatus,renderDashboard};
});
