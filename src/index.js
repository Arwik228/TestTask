import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import './index.css';
import App from './App';

firebase.initializeApp({
  apiKey: "AIzaSyBAaFiDVBW11anFlhIo5dmyOCdiTfkE6SQ",
  authDomain: "fir-7a3c3.firebaseapp.com",
  projectId: "fir-7a3c3",
  storageBucket: "fir-7a3c3.appspot.com",
  messagingSenderId: "261532574537",
  appId: "1:261532574537:web:43a21d05dd769110287098",
  measurementId: "G-VR3WFB3CH7"
});

const db = firebase.firestore();

ReactDOM.render(
  <App connection={db} />,
  document.getElementById('root')
);
