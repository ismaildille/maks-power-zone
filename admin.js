import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,sendPasswordResetEmail,signOut} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {getFirestore,doc,getDoc,setDoc,onSnapshot} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const $=s=>document.querySelector(s),app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),ref=doc(db,'store','catalog');
let catalog={settings:{currency:'MVR',whatsapp:''},products:[]},unsubscribe=null;
const status=s=>$('#status').textContent=s;
const clean=()=>{$('#productForm').reset();$('#pid').value='';};
function display(){
  const area=$('#items');area.replaceChildren();
  for(const p of catalog.products){
    const line=document.createElement('div');line.className='item';
    const title=document.createElement('span');title.textContent=`${p.name} — MVR ${Number(p.price).toFixed(2)}`;
    const edit=document.createElement('button');edit.textContent='Edit';
    edit.onclick=()=>{for(const [id,val] of Object.entries({pid:p.id,pname:p.name,pcat:p.category,pprice:p.price,pstock:p.stock,pdesc:p.description||'',pemoji:p.emoji||''}))$('#'+id).value=val;scrollTo({top:0,behavior:'smooth'})};
    const del=document.createElement('button');del.textContent='Delete';
    del.onclick=async()=>{if(!confirm('Delete '+p.name+'?'))return;try{await persist({...catalog,products:catalog.products.filter(x=>x.id!==p.id)})}catch(e){status('Save failed: '+e.message)}};
    line.append(title,edit,del);area.append(line);
  }
}
async function persist(next){await setDoc(ref,next);status('Saved successfully. Storefront will update.')}
onAuthStateChanged(auth,async user=>{
  if(unsubscribe){unsubscribe();unsubscribe=null}
  $('#dashboard').classList.add('hidden');$('#login').classList.remove('hidden');
  if(!user){status('Sign in with your owner account.');return}
  $('#identity').textContent=user.email;
  try{
    const snap=await getDoc(ref);
    if(!snap.exists()){
      status('Owner signed in. Importing the existing catalog…');
      const r=await fetch('./catalog.json',{cache:'no-store'});if(!r.ok)throw Error('catalog.json missing');
      await persist(await r.json());
    }
    $('#login').classList.add('hidden');$('#dashboard').classList.remove('hidden');
    unsubscribe=onSnapshot(ref,s=>{if(s.exists()){catalog=s.data();display()}},e=>status('Read failed: '+e.message));
    status('Owner access verified by Firestore rules.');
  }catch(e){status('Owner access not configured yet: '+e.message)}
});
$('#loginForm').onsubmit=async e=>{e.preventDefault();status('Signing in…');try{await signInWithEmailAndPassword(auth,$('#email').value,$('#password').value);$('#password').value=''}catch(e){status('Sign-in failed: '+e.code)}};
$('#reset').onclick=async()=>{if(!$('#email').value){status('Enter your email address first.');return}try{await sendPasswordResetEmail(auth,$('#email').value);status('If the account exists, a reset email will be sent.')}catch(e){status('Password reset failed: '+e.code)}};
$('#logout').onclick=()=>signOut(auth);
$('#clear').onclick=clean;
$('#productForm').onsubmit=async e=>{e.preventDefault();const id=$('#pid').value||crypto.randomUUID();const p={id,name:$('#pname').value.trim(),category:$('#pcat').value.trim(),price:Number($('#pprice').value),stock:Number($('#pstock').value),description:$('#pdesc').value.trim(),emoji:$('#pemoji').value.trim()||'📱'};
  if(!p.name||!p.category||!Number.isFinite(p.price)||p.price<0||!Number.isInteger(p.stock)||p.stock<0){status('Please check the form values.');return}
  try{await persist({...catalog,products:[...catalog.products.filter(x=>x.id!==id),p]});clean()}catch(e){status('Save failed: '+e.message)}
};
