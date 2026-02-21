import React, { useState, useEffect } from "react";
// Note: This file expects Stripe.js to be loaded on the page for Stripe Elements flow.
// In index.html include: <script src="https://js.stripe.com/v3/"></script>

import ODU from "./data/odu";

const CONSULT_PRICE = 2.0;

export default function App(){
const [authorized, setAuthorized] = useState(false);
const [code, setCode] = useState("");

const verifyCode = async () => {
  const res = await fetch("https://oracle-fa-server.onrender.com/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  const data = await res.json();

  if (data.success) {
    setAuthorized(true);
  } else {
    alert("Code invalide");
  }
};
  
  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState("");

  const verifyCode = async () => {
    const res = await fetch("http://localhost:3001/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data.success) {
      setAuthorized(true);
    } else {
      alert("Code invalide");
    }
  };

  if (!authorized) {
    return (
      <div style={{padding:20}}>
        <h2>Accès Payant - Oracle du Fa</h2>
        <p>Veuillez effectuer le paiement :</p>
        <p>MTN MoMo : 0169941262</p>
        <p>MOOV Money : 0158297075</p>
        <p>WhatsApp : 0169941262</p>
        <h3>Tarifs :</h3>
        <ul>
          <li>1 Consultation : 1 000F</li>
          <li>3 Consultations : 2 500F</li>
          <li>7 Consultations : 5 000F</li>
          <li>Accès 1 mois illimité : 10 000F</li>
        </ul>
        <p>Après paiement envoyez la référence WhatsApp puis entrez votre code :</p>
        <input placeholder="Entrer votre code"
          onChange={(e)=>setCode(e.target.value)} />
        <button onClick={verifyCode}>Valider</button>
      </div>
    );
    
  }
  const [lang, setLang] = useState("fr");
  const [odu, setOdu] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  function tirageAleatoire(){
    const idx = Math.floor(Math.random() * ODU.length);
    return ODU[idx];
  }

  async function startConsultation(){
    setLoading(true);
    // simulate initial tirage (locked until payment confirmed)
    const result = tirageAleatoire();
    setOdu(result);
    setLoading(false);
  }

  async function payWithCard(){
    // call backend to create payment intent
    try{
      setLoading(true);
      const resp = await fetch("/create-payment-intent", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({amount_eur: CONSULT_PRICE})
      });
      const data = await resp.json();
      if(!data.client_secret){
        alert("Erreur création paiement: " + JSON.stringify(data));
        setLoading(false); return;
      }
      // Use Stripe.js to confirm card payment (requires Stripe elements on page)
      const stripe = window.Stripe ? window.Stripe(data.publishableKey || "") : null;
      if(!stripe){
        // Fallback: open Stripe Checkout session flow could be implemented server-side.
        alert("Stripe.js non disponible. Veuillez utiliser Mobile Money ou Flooz pour le prototype.");
        setLoading(false);
        return;
      }
      // For prototype, we'll simulate success without full Stripe Elements flow.
      // In production use stripe.confirmCardPayment(client_secret, {payment_method: {card: cardElement}})
      // Here we simulate immediate success by calling webhook-simulating endpoint on backend.
      const confirmResp = await fetch("/simulate-payment-success", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({client_secret: data.client_secret, method: "card"})
      });
      const confirmData = await confirmResp.json();
      if(confirmData.ok){
        unlockInterpretation("card");
      } else {
        alert("Paiement non confirmé.");
      }
    } catch(e){
      console.error(e); alert("Erreur paiement: "+e.message);
    } finally{ setLoading(false); }
  }

  async function payMobileMoney(provider){
    // For Mobile Money or Flooz the typical flow is: instruct user to pay to a number, then operator calls /mobile-money/notify webhook.
    // For the prototype simulate immediate confirmation:
    setLoading(true);
    try{
      const resp = await fetch("/mobile-money/simulate", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({provider, amount_eur: CONSULT_PRICE, oduKey: odu?.key})
      });
      const data = await resp.json();
      if(data.ok) unlockInterpretation(provider);
      else alert("Erreur de paiement mobile.");
    } catch(e){
      alert("Erreur: "+e.message);
    } finally{ setLoading(false); }
  }

  function unlockInterpretation(method){
    setShowFull(true);
    const timestamp = new Date().toISOString();
    setHistory([{when:timestamp, odu, method, price_eur:CONSULT_PRICE}, ...history]);
  }

  return (
    <div style={{fontFamily:"system-ui,Arial, sans-serif", padding:20, background:"#FFF8EF"}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <h1 style={{color:"#B7791F"}}>Oracle du Fa</h1>
          <div style={{fontSize:13, color:"#6B4226"}}>Consultation spirituelle — {CONSULT_PRICE} €</div>
        </div>
        <div>
          <button onClick={()=>setLang("fr")} style={{marginRight:6}}>FR</button>
          <button onClick={()=>setLang("fon")}>FON</button>
        </div>
      </header>

      <main style={{marginTop:20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:18}}>
        <section>
          <h2>{lang==="fr"?"Commencer une consultation":"Sè kò nò dò"}</h2>
          <p>{lang==="fr"?`Prix: ${CONSULT_PRICE} €`:"Gbèhòn kòno: 2 €"}</p>
          <div style={{marginTop:12}}>
            <button onClick={startConsultation} disabled={loading}>{loading ? "..." : (lang==="fr"?"Tirer les graines":"Tiré gén")}</button>
          </div>

          <div style={{marginTop:12, padding:10, border:"1px solid #E6C7A0", borderRadius:8, background:"#FFF"}}>
            <div style={{fontWeight:600}}>{lang==="fr"?"Moyens de paiement":"Gbòn kòno"}</div>
            <ul style={{marginTop:8}}>
              <li>Mobile Money (MTN, Wave, Moov)</li>
              <li>Flooz</li>
              <li>Carte bancaire (Stripe)</li>
            </ul>
            <div style={{fontSize:12, marginTop:8}}>Remarque: ce prototype simule les confirmations.</div>
          </div>
        </section>

        <section>
          <h3>{lang==="fr"?"Résultat":"Gba"}</h3>
          <div style={{minHeight:220, padding:12, border:"1px solid #EDE1D0", borderRadius:8, background:"#fff"}}>
            {odu ? (
              <div>
                <div><strong>{lang==="fr"?"Odù:":"Odù:"}</strong> {lang==="fr"?odu.name_fr:odu.name_fon}</div>
                <div style={{marginTop:6}}>{lang==="fr"?"Résumé:": "Aédò:"} {lang==="fr"?odu.short_fr:odu.short_fon}</div>

                {!showFull ? (
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:13, marginBottom:8}}>{lang==="fr"?"Choisissez un moyen de paiement pour débloquer l'interprétation complète.":"Choisi gbòn kòno."}</div>
                    <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                      <div style={{marginTop:12}}>
     <h4>Paiement requis</h4>

  <p>Veuillez effectuer le paiement :</p>

  <p><strong>MTN MoMo :</strong> 0169941262</p>
  <p><strong>MOOV Money :</strong> 0158297075</p>

  <p>Après paiement, envoyez la référence sur WhatsApp :</p>

  <p><strong>WhatsApp :</strong> 0169941262</p>

  <h4>Tarifs :</h4>
  <ul>
    <li>1 Consultation : 1 000F</li>
    <li>3 Consultations : 2 500F</li>
    <li>7 Consultations : 5 000F</li>
    <li>Accès 1 mois : 10 000F</li>
  </ul>

  <p>Ensuite entrez votre code :</p>

  <input
    placeholder="Entrer votre code d'accès"
    onChange={(e)=>setCode(e.target.value)}
  />

  <button onClick={verifyCode}>Valider</button>
</div>
                  </div>
                ) : (
                  <div style={{marginTop:12}}>
                    <h4>{lang==="fr"?"Interprétation complète":"Aédò kònò"}</h4>
                    <pre style={{whiteSpace:"pre-wrap"}}>{lang==="fr"?odu.full_fr:odu.full_fon}</pre>
                    <div style={{marginTop:8, padding:8, background:"#FFF3D9", borderRadius:6}}>
                      <strong>{lang==="fr"?"Rituels / Offrandes":"Gbò kòn / Rituels"}</strong>
                      <div>{odu.ritual}</div>
                      <div style={{marginTop:6}}><a href={"https://wa.me/22960000000?text=Bonjour,%20je%20souhaite%20organiser%20les%20rituels%20suite%20%C3%A0%20ma%20consultation."} target="_blank" rel="noreferrer">Contacter le bokonon (WhatsApp)</a></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{color:"#6B4226"}}>{lang==="fr"?"Aucun tirage pour le moment.":"Yènò gén."}</div>
            )}
          </div>

          <div style={{marginTop:12}}>
            <h4>{lang==="fr"?"Historique":"Histoirè"}</h4>
            {history.length===0 ? <div style={{fontSize:12}}>Aucun historique.</div> : (
              <ul>{history.map((h,idx)=>(<li key={idx} style={{padding:6, borderBottom:"1px solid #EEE"}}>{new Date(h.when).toLocaleString()} - {lang==="fr"?h.odu.name_fr:h.odu.name_fon} - {h.method} - {h.price_eur} €</li>))}</ul>
            )}
          </div>
        </section>
      </main>

      <footer style={{marginTop:20, fontSize:12, color:"#6B4226"}}>© Oracle du Fa — Prototype — Consultation: {CONSULT_PRICE} € — Rituels gérés par le bokonon</footer>
    </div>
  );
}
