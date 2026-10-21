const ACCESS_KEY='YOUR_WEB3FORMS_ACCESS_KEY';
const form=document.querySelector('#booking-form');
const statusBox=document.querySelector('#status');
const submit=document.querySelector('#submit-btn');
const dateInput=document.querySelector('#date');
const today=new Date();
const y=today.getFullYear(),m=String(today.getMonth()+1).padStart(2,'0'),d=String(today.getDate()).padStart(2,'0');
dateInput.min=`${y}-${m}-${d}`;
function status(message,type){statusBox.textContent=message;statusBox.className=`status show ${type}`;}
form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  if(!ACCESS_KEY||ACCESS_KEY==='YOUR_WEB3FORMS_ACCESS_KEY'){status('Add your Web3Forms access key in site/assets/booking.js before using online requests.','error');return;}
  submit.disabled=true;
  const fd=new FormData(form);
  const payload={
    access_key:ACCESS_KEY,
    subject:'New Desi Barber appointment request',
    from_name:'Desi Barber Website',
    location:fd.get('location'),
    service:fd.get('service'),
    preferred_barber:fd.get('barber')||'No preference',
    preferred_date:fd.get('preferred_date'),
    preferred_time:fd.get('preferred_time'),
    name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),notes:fd.get('notes')||'None',botcheck:false
  };
  payload.message=`APPOINTMENT REQUEST - REQUIRES SHOP CONFIRMATION\n\nLocation: ${payload.location}\nService: ${payload.service}\nBarber: ${payload.preferred_barber}\nPreferred date: ${payload.preferred_date}\nPreferred time: ${payload.preferred_time}\n\nCustomer: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nNotes: ${payload.notes}`;
  try{
    const res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json().catch(()=>null);
    if(!res.ok||data?.success!==true)throw new Error();
    status('Request sent. Desi Barber will contact you to confirm the appointment.','success');
    form.reset();
    dateInput.min=`${y}-${m}-${d}`;
  }catch{status('We could not send your request. Please call the location directly.','error');}
  finally{submit.disabled=false;}
});
