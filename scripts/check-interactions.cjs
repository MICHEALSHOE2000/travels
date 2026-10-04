const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor(){ this.handlers={};this.attributes={};this.hidden=false;this.textContent='';this.value='';this.type='text';this.validity={valid:true};this.options=[]; }
  addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
  async fire(type,event={}){for(const fn of this.handlers[type]??[]) await fn({target:this,preventDefault(){},...event});}
  setAttribute(k,v){this.attributes[k]=v;}
  getAttribute(k){return this.attributes[k];}
  focus(){this.focused=true;}
  scrollIntoView(){this.scrolled=true;}
  contains(target){return target===this;}
  querySelectorAll(){return [];}
}
const ids={};for(const id of ['mobile-nav','form-errors','enquiry-ready','enquiry-text','email-draft','copy-status','journal-status','copy-enquiry']) ids[id]=new Element();
ids['mobile-nav'].hidden=true;ids['enquiry-ready'].hidden=true;
const toggle=new Element();toggle.setAttribute('aria-expanded','false');
const form=new Element();form.elements={};
for(const name of ['name','email','tripType','destination','departureDate','flexibility','travelers','budget','phone','notes']){const e=new Element();e.name=name;e.id=name;form.elements[name]=e;ids[name+'-error']=new Element();}
form.elements.name.required=true;form.elements.email.required=true;form.elements.email.type='email';
form.elements.tripType.options=[{value:'Disney'},{value:'Cruise'}];
const filterAll=new Element(),filterPacking=new Element();filterAll.dataset={filter:'all'};filterPacking.dataset={filter:'packing'};
const packing=new Element(),budget=new Element();packing.dataset={category:'packing'};budget.dataset={category:'budget'};
const document=new Element();document.querySelector=selector=>({'.menu-toggle':toggle,'#mobile-nav':ids['mobile-nav'],'#trip-form':form,...Object.fromEntries(Object.entries(ids).map(([k,v])=>['#'+k,v]))}[selector]);document.getElementById=id=>ids[id];
document.querySelectorAll=selector=>selector==='[data-filter]'?[filterAll,filterPacking]:selector==='[data-category]'?[packing,budget]:[];
let copied='',copyFail=false;
class FormDataMock {constructor(f){this.f=f;}get(n){return this.f.elements[n]?.value;}}
const context={document,location:{search:'?trip=Disney'},URLSearchParams,FormData:FormDataMock,Date,Number,String,encodeURIComponent,window:{matchMedia:()=>({matches:false,addEventListener(){}})},navigator:{clipboard:{async writeText(t){if(copyFail)throw new Error('Denied');copied=t;}}}};
vm.runInNewContext(fs.readFileSync('dist/assets/site.js','utf8'),context);
(async()=>{
  assert.equal(form.elements.tripType.value,'Disney');
  await toggle.fire('click');assert.equal(ids['mobile-nav'].hidden,false);assert.equal(toggle.getAttribute('aria-expanded'),'true');
  await document.fire('keydown',{key:'Escape'});assert.equal(ids['mobile-nav'].hidden,true);assert.equal(toggle.focused,true);
  await filterPacking.fire('click');assert.equal(budget.hidden,true);assert.equal(packing.hidden,false);assert.equal(ids['journal-status'].textContent,'1 article shown');
  await filterAll.fire('click');assert.equal(budget.hidden,false);
  await form.fire('submit');assert.equal(ids['form-errors'].hidden,false);assert.equal(ids['enquiry-ready'].hidden,true);assert.equal(form.elements.name.focused,true);
  form.elements.name.value='Test Traveler';form.elements.email.value='broken';form.elements.email.validity.valid=false;
  await form.fire('submit');assert.match(ids['email-error'].textContent,/valid email/);assert.equal(ids['enquiry-ready'].hidden,true);
  form.elements.email.value='test@example.com';form.elements.email.validity.valid=true;form.elements.travelers.value='0';
  await form.fire('submit');assert.match(ids['travelers-error'].textContent,/whole number/);
  form.elements.travelers.value='2.5';await form.fire('submit');assert.match(ids['travelers-error'].textContent,/whole number/);
  form.elements.travelers.value='2';form.elements.departureDate.value='2000-01-01';await form.fire('submit');assert.match(ids['departureDate-error'].textContent,/future/);
  form.elements.departureDate.value='';form.elements.notes.value='<script>alert("not executed")</script> & a coastal day';
  await form.fire('submit');assert.equal(ids['form-errors'].hidden,true);assert.equal(ids['enquiry-ready'].hidden,false);assert.equal(ids['enquiry-ready'].focused,true);
  assert.ok(ids['email-draft'].href.startsWith('mailto:sarah_harry@gettravelwithsarah.com?subject='));
  const query=new URLSearchParams(ids['email-draft'].href.split('?')[1]);assert.ok(query.get('body').includes(form.elements.notes.value));assert.ok(query.get('body').includes('Travelers: 2'));assert.ok(query.get('body').includes('Approximate date: Not decided yet'));
  await ids['copy-enquiry'].fire('click');assert.equal(copied,ids['enquiry-text'].textContent);assert.match(ids['copy-status'].textContent,/copied/);
  copyFail=true;await ids['copy-enquiry'].fire('click');assert.match(ids['copy-status'].textContent,/could not copy/);
  await form.fire('input');assert.equal(ids['enquiry-ready'].hidden,true);
  console.log('PASS: menu/Escape, journal filters, trip preselection, required/email/number/date errors, reviewed enquiry, safe email encoding, clipboard success/failure, edited enquiry invalidation.');
})().catch(e=>{console.error(e);process.exitCode=1;});
