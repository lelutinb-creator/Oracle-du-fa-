import React, { useState } from "react";
import ODU from "./data/odu";

export default function App(){

const [authorized, setAuthorized] = useState(false);
const [code, setCode] = useState("");
const [odu, setOdu] = useState(null);
const [showFull, setShowFull] = useState(false);

const verifyCode = async () => {

const res = await fetch("https://oracle-du-fa-server.onrender.com/verify-code",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({code})
});

const data = await res.json();

if(data.success){
setAuthorized(true);
}else{
alert("Code invalide");
}

};

function tirageAleatoire(){
const idx = Math.floor(Math.random()*ODU.length);
return ODU[idx];
}

function startConsultation(){
const result = tirageAleatoire();
setOdu(result);
setShowFull(false);
}

if(!authorized){

return(

<div style={{padding:20}}>

<h2>Accès Payant - Oracle du Fa</h2>

<p>Veuillez effectuer le paiement :</p>

<p><strong>MTN MoMo :</strong> 0169941262</p>
<p><strong>MOOV Money :</strong> 0158297075</p>

<p>Après paiement envoyez la référence sur WhatsApp :</p>

<p><strong>WhatsApp :</strong> 0169941262</p>

<h3>Tarifs :</h3>

<ul>
<li>1 Consultation : 1 000F</li>
<li>3 Consultations : 2 500F</li>
<li>7 Consultations : 5 000F</li>
<li>Accès 1 mois illimité : 10 000F</li>
</ul>

<p>Entrez votre code d'accès :</p>

<input
placeholder="Entrer votre code"
onChange={(e)=>setCode(e.target.value)}
/>

<button onClick={verifyCode}>Valider</button>

</div>

);

}

return(

<div style={{padding:20}}>

<h1>Oracle du Fa</h1>

<button onClick={startConsultation}>
Tirer les graines
</button>

<br/><br/>

{odu && (

<div>

<h3>{odu.name_fr}</h3>

<p>{odu.short_fr}</p>

{!showFull ? (

<button onClick={()=>setShowFull(true)}>
Voir interprétation complète
</button>

) : (

<div>

<pre>{odu.full_fr}</pre>

<div style={{marginTop:10}}>

<a
href="https://wa.me/2290169941262"
target="_blank"
rel="noreferrer"
>

Organiser les rituels sur WhatsApp

</a>

</div>

</div>

)}

</div>

)}

</div>

);

}
                    
