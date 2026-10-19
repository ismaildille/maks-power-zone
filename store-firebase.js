import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import {getFirestore,doc,onSnapshot} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const db=getFirestore(initializeApp(firebaseConfig));
onSnapshot(doc(db,'store','catalog'),s=>{
  if(s.exists() && Array.isArray(s.data().products)){
    catalog={settings:s.data().settings||{currency:'MVR',whatsapp:''},products:s.data().products};
    render();
  }
},e=>console.warn('Firestore unavailable; using published catalog.',e.code));
