import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ── Firebase Config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAiWRYCaIUzwzF-nlEXnSPSa-ADaf1t4_k",
  authDomain: "test-65604.firebaseapp.com",
  projectId: "test-65604",
  storageBucket: "test-65604.appspot.com",
  messagingSenderId: "1001282245035",
  appId: "1:1001282245035:web:de3167be1a956af01342ee",
  measurementId: "G-MZRZN1B9VW"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ═══════════════════════════════════════════════════════════════════
// CURRENCY & LANGUAGE CONTEXT
// ═══════════════════════════════════════════════════════════════════

const AppContext = createContext({});
const useApp = () => useContext(AppContext);

const CURRENCIES = {
  USD: { symbol: "$", rate: 1,    label: "USD" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR" },
};

const CLOUDINARY_IMAGES = {
  "trending": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-1-1_dgqhod.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-1-2_edysvp.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-2-1_pjglz0.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-2-2_hovkbx.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-3-1_xdrecz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-3-2_apxplm.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-4-1_dblema.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-4-2_egmn1y.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-5-1_vi4ekn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-5-2_mqn1h3.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-6-1_eqyabf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-6-2_kitul6.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-7-1_e2akal.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-7-2_abhe5n.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-8-1_jibalk.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-8-2_io3bhx.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-9-1_jvpwbq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-9-2_ysv7fg.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-10-1_zfjarn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-10-2_mu15zi.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-11-1_opnzum.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-11-2_n9kbxe.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-12-1_mqibn2.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-12-2_f9bllz.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-13-1_rcpg0z.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-13-2_mctnpu.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-14-1_y1mgdu.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-14-2_mr9dow.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-15-1_wvoqvl.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-15-2_qwncee.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-16-1_inrudz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-16-2_p4fdr2.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-17-1_up8vad.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-17-2_k9tnmg.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-18-1_b6sysd.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-18-2_lnbhbb.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-19-1_zxzwjc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-19-2_wkbok7.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-20-1_l6a6za.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-20-2_csyey8.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-21-1_inycrh.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-21-2_jetokf.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-22-1_winkw9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-22-2_jbpqqs.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-23-1_ui5a32.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-23-2_tequ14.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-24-1_rh6olq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-24-2_h62ave.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-25-1_p1zwfz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-25-2_s1bvel.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-26-1_tvemzb.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-26-2_ctxqdz.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-27-1_jtudak.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-27-2_pnfehm.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-28-1_msid0h.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-28-2_rutgkz.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-29-1_uyzhdy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-29-2_akmukn.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-30-1_phnwic.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/trending-30-2_k8w5ju.jpg"],
  },
  "onsale": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-1-1_gveqje.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-1-2_qtm1gs.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-2-1_mbnzhg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-2-2_rtnwvd.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-3-1_mvwc1r.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-3-2_zftxxe.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-4-1_elwykd.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-4-2_rzbkzt.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-5-1_j1a1mv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-5-2_tx3otw.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-6-1_fgs0af.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-6-2_zqwabp.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-7-1_vigiot.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-7-2_rr4uc2.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-8-1_xaf1iv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-8-2_ymgdjw.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-9-1_cmttme.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-9-2_lrq3h0.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-10-1_vebt8p.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-10-2_tib3ti.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-11-1_myrurq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-11-2_g25iso.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-12-1_nh0qqn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-12-2_oqxlvy.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-13-1_o2t1qo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-13-2_ufwyjs.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-14-1_hgw62p.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-14-2_oehq7o.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-15-1_wfyudu.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-15-2_qmyros.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-16-1_mrkyyv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-16-2_ep7ufk.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-17-1_rce3cm.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-17-2_adnmyl.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-18-1_jm5ede.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-18-2_vaw7pk.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-19-1_qjsr5x.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-19-2_wkyjtb.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-20-1_nvrvyq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-20-2_piu8wl.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-21-1_y1ggun.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-21-2_xy1a7z.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-22-1_ud3odo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-22-2_i4hkew.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-23-1_o8cdjf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-23-2_n5yecb.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-24-1_bq66eu.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-24-2_ep76gg.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-25-1_zhkvhz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-25-2_nawseh.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-26-1_mk5wrs.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-26-2_cja74m.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-27-1_prwmkt.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-27-2_dslthh.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-28-1_uzbx8j.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-28-2_i0a48h.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-29-1_eqhprd.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-29-2_ygpnz0.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-30-1_i833tu.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/onsale-30-2_f6rlj4.jpg"],
  },
  "home": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-1-1_knoesm.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-1-2_tepgqn.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-2-1_pyq0rq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-2-2_o3jwxa.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-3-1_meocs3.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-3-2_yogbuq.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-4-1_i11dqz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-4-2_rwivdz.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-5-1_uotgxf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-5-2_lvvnuh.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-6-1_mrvzs7.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-6-2_xyqzwg.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-7-1_kejdxd.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-7-2_bjqlvh.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-8-1_ohtove.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-8-2_hxdve7.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-9-1_dsty1q.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-9-2_hn3wec.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-10-1_qvet6u.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-10-2_h27k2k.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-11-1_mxh3tr.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-11-2_m30fqv.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-12-1_hcwbhz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-12-2_guck8a.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-13-1_tkdhdi.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-13-2_xmaoxi.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-14-1_g3pxkv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-14-2_hgpblk.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-15-1_tler8y.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-15-2_q1n64y.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-16-1_me3fzc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-16-2_aootfz.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-17-1_q7noci.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-17-2_lcpsvk.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-18-1_c6qlzg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-18-2_aplgd4.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-19-1_o8nnbt.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-19-2_tc6bbk.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-20-1_ggzybs.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-20-2_bpiwjg.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-21-1_sgs1fo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-21-2_lvo4k1.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-22-1_ovo7ok.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-22-2_zqeqod.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-23-1_cynsbs.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-23-2_f9h8f8.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-24-1_vfuznh.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-24-2_ykqwdx.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-25-1_n64vqs.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-25-2_wokoyr.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-26-1_d9ywwz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-26-2_pr9h4a.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-27-1_x7hd1m.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-27-2_jlyxkh.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-28-1_d3lvz5.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-28-2_fqw88o.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-29-1_adknl8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-29-2_q34brq.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-30-1_gady0w.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/home-30-2_brajwd.jpg"],
  },
  "kitchen": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-1-1_fiprwg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-1-2_cklgz6.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-2-1_m9kjk7.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-2-2_gj1zps.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-3-1_zy1ucv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-3-2_ryakyf.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-4-1_xehlqc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-4-2_kja8jy.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-5-1_kuxffn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-5-2_z9dnsb.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-6-1_wiwj1g.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-6-2_wjvkay.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-7-1_mnpzyj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-7-2_dpoett.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-8-1_eh3rhb.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-8-2_docfrr.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-9-1_gfhyc8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-9-2_puxvz6.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-10-1_iukjqj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-10-2_da27gl.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-11-1_fewx5f.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-11-2_jjq40p.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-12-1_mv0wa8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-12-2_q9p4gb.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-13-1_bsrhev.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-13-2_ifpjcr.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-14-1_jchdiz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-14-2_tctrgp.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-15-1_yxlwwm.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-15-2_ssb0m7.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-16-1_yi7dpn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-16-2_jgas9n.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-17-1_ibrbha.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-17-2_tpcud1.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-18-1_jtlwhl.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-18-2_nqydh3.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-19-1_cro4yi.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-19-2_qanlop.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-20-1_fhpuxo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-20-2_zhudo2.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-21-1_l8pf8q.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-21-2_hixs1g.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-22-1_dnqehw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-22-2_e4js4j.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-23-1_lsz7pe.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-23-2_rhha4y.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-24-1_sjgmy4.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-24-2_zuucfk.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-25-1_ygfb5e.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-25-2_txpkog.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-26-1_dwlbi1.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-26-2_kkse0r.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-27-1_ricqhr.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-27-2_hfgfxb.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-28-1_hf0syz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-28-2_bscaq7.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-29-1_gzjab2.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-29-2_wxcubb.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-30-1_j5qxeb.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/kitchen-30-2_zopmw8.jpg"],
  },
  "electronics": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-1-1_lcnroh.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-1-2_iygvuh.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-2-1_i9kwwn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-2-2_qyjkjb.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-3-1_pzg3px.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-3-2_e578nv.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-4-1_qldyjt.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-4-2_pxgwxd.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-5-1_jjpx46.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-5-2_ftrs33.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-6-1_gpmrua.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-6-2_b1bevg.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-7-1_bztxn5.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-7-2_cp4jgu.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-8-1_nyub43.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-8-2_jcvh1t.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-9-1_yyi8d7.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-9-2_iampw2.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-10-1_hkurlj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-10-2_ytxsoz.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-11-1_vjjlww.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-11-2_zfcfjm.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-12-1_neoo7a.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-12-2_clzgnn.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-13-1_uhno55.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-13-2_kibw2h.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-14-1_tm3u07.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-14-2_lhxugr.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-15-1_w1xlds.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-15-2_ni1agu.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-16-1_z3xhto.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-16-2_igvjvd.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-17-1_ami8qg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-17-2_ncbxqf.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-18-1_fpcupn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-18-2_qgyofc.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-19-1_snkrqf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-19-2_qc3dxx.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-20-1_fykh5i.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-20-2_mfief1.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-21-1_nfiyeh.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-21-2_fgs7jz.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-22-1_ixjs9j.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-22-2_at7obu.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-23-1_dxaznw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-23-2_ki2ht9.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-24-1_agedsz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-24-2_rmuovr.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-25-1_v2yn3n.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-25-2_nzqlj0.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-26-1_ut2lfq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-26-2_rhyms5.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-27-1_y1y0lt.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-27-2_vz317w.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-28-1_nxwlvm.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-28-2_hcdkgi.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-29-1_esdrli.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-29-2_pzph3b.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-30-1_bcmmg7.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/electronics-30-2_griuhn.jpg"],
  },
  "fashion": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-1-1_p4ofgo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-1-2_n4em31.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-2-1_xhqmml.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-2-2_ylhzuz.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-3-1_hcrmgk.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-3-2_igr5wx.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-4-1_xmscid.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-4-2_dotgmr.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-5-1_hod5by.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-5-2_z1n9om.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-6-1_myqxsi.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-6-2_zsn9ck.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-7-1_hyxj9x.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-7-2_fs1k9z.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-8-1_libvyw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-8-2_mayuih.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-9-1_eafwb0.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-9-2_nplt2y.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-10-1_iclzpw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-10-2_xy96vi.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-11-1_mqbxsj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-11-2_nh1fze.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-12-1_lmvij1.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-12-2_s4ngch.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-13-1_m042en.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-13-2_gjj7r9.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-14-1_qtpduc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-14-2_tajfe4.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-15-1_cp6yl9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-15-2_letib8.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-16-1_ub8lwx.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-16-2_banp1f.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-17-1_ngko3l.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-17-2_k6fgwt.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-18-1_fy030z.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-18-2_d6r4dv.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-19-1_tlc8gp.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-19-2_r3o61n.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-20-1_txkfpe.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-20-2_lxsa8m.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-21-1_hopzz6.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-21-2_ui7pan.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-22-1_dmepg9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-22-2_pqbhl6.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-23-1_kb367e.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-23-2_c03n9g.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-24-1_np63yq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-24-2_kimlob.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-25-1_p8mix6.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-25-2_ysvrmk.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-26-1_oawvib.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-26-2_jigs2t.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-27-1_obahlp.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-27-2_drlwyq.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-28-1_ea3cny.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-28-2_axpec6.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-29-1_o7xjjl.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-29-2_yt2bww.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-30-1_am1k3c.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/fashion-30-2_k0uvud.jpg"],
  },
  "decoration": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-1-1_ckfkgf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-1-2_vgsdnq.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-2-1_hcwscj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-2-2_ssenon.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-3-1_mcxtny.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-3-2_iuhuro.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-4-1_k5j2po.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-4-2_z3e2gx.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-5-1_j2kr9v.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-5-2_lbevre.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-6-1_lfxmjy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-6-2_tuvan4.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-7-1_vl7gfl.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-7-2_guy5am.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-8-1_tjmo8v.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-8-2_orgzrm.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-9-1_nr4ryo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-9-2_lq2l2d.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-10-1_rmzr00.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-10-2_w3lxqk.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-11-1_xkehx1.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-11-2_ssgzhc.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-12-1_hozd31.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-12-2_utpac0.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-13-1_yjneol.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-13-2_vn23id.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-14-1_wtmgpq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-14-2_nflhqj.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-15-1_opjrsq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-15-2_if2ix4.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-16-1_xitlfc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-16-2_bzpvuq.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-17-1_qmfndq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-17-2_tkvlua.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-18-1_hcupdn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-18-2_s0b8by.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-19-1_ns6cnj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-19-2_yrl4bo.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-20-1_cpbzqv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-20-2_u3hlva.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-21-1_zdiwuc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-21-2_rrwcmb.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-22-1_a41zxn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-22-2_oiw6li.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-23-1_xh6ccq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-23-2_m1lml2.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-24-1_us1qvn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-24-2_we2rct.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-25-1_bafjdy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-25-2_vodo0x.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-26-1_rjyxz8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-26-2_bm2m1g.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-27-1_nxpiix.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-27-2_dkepg3.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-28-1_jy8n5l.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-28-2_jiljbf.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-29-1_sj2gj0.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-29-2_wccysg.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-30-1_zwmpy2.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/decoration-30-2_pmk0xj.jpg"],
  },
  "gaming": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-1-1_s2ts5r.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-1-2_wegfz2.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-2-1_xefagw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-2-2_bshywk.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-3-1_kl4we4.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-3-2_jzx7m5.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-4-1_qbx6ce.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-4-2_zbqxmj.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-5-1_ofhy7h.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-5-2_mqceqj.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-6-1_x5trfz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-6-2_nilo40.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-7-1_rml2ac.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-7-2_nzo4ei.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-8-1_lgo3xm.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-8-2_h0kmee.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-9-1_qsqhbe.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-9-2_a3wrxj.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-10-1_qdycwv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-10-2_uxfe9a.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-11-1_lau1ie.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-11-2_xpsg4e.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-12-1_hody2u.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-12-2_lxrfvk.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-13-1_ctupqu.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-13-2_oridei.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-14-1_llnja3.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-14-2_yb5nqu.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-15-1_viysrb.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-15-2_fxiye0.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-16-1_xg0iq2.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-16-2_u4v4gw.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-17-1_i04sey.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-17-2_cs7st5.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-18-1_wqmk6r.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-18-2_tnwmmx.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-19-1_eu2dgh.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-19-2_qxzw1k.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-20-1_an5qfq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-20-2_vkc1ct.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-21-1_mu1lic.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-21-2_fwccdu.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-22-1_rbafky.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-22-2_jzq7wu.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-23-1_mlapt1.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-23-2_dv1ork.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-24-1_pvemsw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-24-2_k9gr9m.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-25-1_atc55r.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-25-2_ijtkal.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-26-1_g6wemp.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-26-2_cvaz90.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-27-1_nsirp9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-27-2_vtbpkw.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-28-1_vjfaqj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-28-2_eovs7a.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-29-1_upzzo9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-29-2_x17dvc.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-30-1_nq3n44.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/gaming-30-2_jq7w3k.jpg"],
  },
  "footsports": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-1-1_qjuqk1.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-1-2_vsmibr.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-2-1_fyb1rk.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-2-2_tkka6r.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-3-1_doocsr.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-3-2_gx8tzk.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-4-1_cfdrgp.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-4-2_mzxgcf.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-5-1_jlnhnq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-5-2_cydpxg.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-6-1_ard1bg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-6-2_vn0ufs.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-7-1_e8lmgo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-7-2_rhbwmz.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-8-1_w5oepv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-8-2_lhx4ee.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-9-1_okqiei.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-9-2_yfie3h.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-10-1_ukogr9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-10-2_wecc1x.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-11-1_fjltyo.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-11-2_qcvjb8.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-12-1_xecgx7.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-12-2_n4es3z.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-13-1_u5pc1v.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-13-2_kres1a.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-14-1_ce5k3f.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-14-2_fjibf0.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-15-1_yuvtzk.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-15-2_y6xeyi.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-16-1_zwo1df.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-16-2_xh0xlt.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-17-1_z0lnxe.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-17-2_nbipgf.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-18-1_r7zels.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-18-2_qncivt.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-19-1_wvhoy2.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-19-2_dvgvwe.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-20-1_mjrmuw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-20-2_t1z9se.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-21-1_d8j7qe.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-21-2_mdjse7.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-22-1_nvzr17.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-22-2_loucns.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-23-1_ohupwg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-23-2_k9stdz.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-24-1_jkovix.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-24-2_vnqwas.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-25-1_qtap06.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-25-2_v6pd2e.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-26-1_a7ny0i.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-26-2_xcuqip.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-27-1_w5hxwk.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-27-2_hdbbsk.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-28-1_grgg1g.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-28-2_neqrel.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-29-1_exrvps.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-29-2_ccgfmj.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-30-1_ja6vhw.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/footsports-30-2_gbkxh3.jpg"],
  },
  "clothing": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-1-1_bkbk1g.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-1-2_mdobum.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-2-1_exsspy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-2-2_wlge8a.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-3-1_hocmvz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-3-2_n7pjpb.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-4-1_xnyfiy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-4-2_ydibwt.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-5-1_marxxy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-5-2_za8hzm.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-6-1_xucpvq.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-6-2_mvo8vg.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-7-1_uxpbp0.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-7-2_xrpvxy.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-8-1_y4ezcy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-8-2_j0s9ur.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-9-1_prvhxj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-9-2_l8npsy.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-10-1_lp2m4r.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-10-2_diwwl6.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-11-1_wzqkoa.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-11-2_innvxz.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-12-1_mktvux.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-12-2_bxcxqp.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-13-1_qbr3tj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-13-2_hfhqcx.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-14-1_zaq2o8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-14-2_yidzro.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-15-1_uas4xn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-15-2_pkby6q.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-16-1_kx9b3o.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-16-2_vadytc.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-17-1_dnbomj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-17-2_sejoqw.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-18-1_dc4n5w.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-18-2_zzspsa.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-19-1_gid3rr.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-19-2_pnj9b9.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-20-1_dp0d9l.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-20-2_tmdgpg.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-21-1_g6odis.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-21-2_xack6a.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-22-1_ktzrvl.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-22-2_yh5jpp.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-23-1_ogw9xj.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-23-2_sxrzur.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-24-1_aihutn.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-24-2_r82awc.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-25-1_brfp4g.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-25-2_tj0dvf.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-26-1_sdkoas.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-26-2_ypyvqh.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-27-1_merw7c.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-27-2_xvq71k.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-28-1_w6pfxx.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-28-2_qhzr81.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-29-1_enp8u8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-29-2_wca5pt.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-30-1_axhj1z.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/clothing-30-2_nvuk4k.jpg"],
  },
  "phones": {
    1: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-1-1_r2tsgz.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-1-2_qjdeik.jpg"],
    2: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-2-1_wvdan4.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-2-2_fpwumy.jpg"],
    3: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-3-1_rs4jxm.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-3-2_omuzhf.jpg"],
    4: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-4-1_ssiipg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-4-2_avcuzu.jpg"],
    5: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-5-1_xuqrca.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-5-2_twasfi.jpg"],
    6: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-6-1_wnhlxe.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-6-2_inuezi.jpg"],
    7: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-7-1_bkdfba.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-7-2_b2c3ox.jpg"],
    8: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-8-1_wdlvno.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-8-2_f7c4xe.jpg"],
    9: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-9-1_hxzbfa.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-9-2_aeullx.jpg"],
    10: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-10-1_fm8n7n.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-10-2_kvjsdv.jpg"],
    11: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-11-1_a303m9.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-11-2_fpyadq.jpg"],
    12: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-12-1_npsaer.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-12-2_xrasqq.jpg"],
    13: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-13-1_vdpeaa.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-13-2_y1sw1v.jpg"],
    14: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-14-1_stuv9e.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-14-2_qdfqfz.jpg"],
    15: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-15-1_rfide7.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-15-2_jxzaq0.jpg"],
    16: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-16-1_vmxhzd.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-16-2_zjldiq.jpg"],
    17: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-17-1_flenvy.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-17-2_hapaje.jpg"],
    18: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-18-1_clsmyc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-18-2_sr5pv5.jpg"],
    19: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-19-1_gl9sbl.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-19-2_gqob4a.jpg"],
    20: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-20-1_vyi6ku.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-20-2_gts8qy.jpg"],
    21: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-21-1_bfkd3h.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-21-2_ehyhzt.jpg"],
    22: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-22-1_yqusbv.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-22-2_wwq36i.jpg"],
    23: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-23-1_ojpraf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-23-2_nbqqsc.jpg"],
    24: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-24-1_fkkcuh.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-24-2_fzosb9.jpg"],
    25: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-25-1_lp2wic.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-25-2_a0kumn.jpg"],
    26: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-26-1_afkfox.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-26-2_dpic9l.jpg"],
    27: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-27-1_nxyfd8.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-27-2_jxj3cf.jpg"],
    28: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-28-1_w3rhhg.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-28-2_lamie0.jpg"],
    29: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-29-1_ekamqf.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-29-2_o7eoge.jpg"],
    30: ["https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-30-1_ebatcc.jpg", "https://res.cloudinary.com/dh9g5piy5/image/upload/w_400,h_400,c_pad,b_white,f_auto,q_auto/phone-30-2_npgujc.jpg"],
  },
};

const TRANSLATIONS = {
  English: {
    home:"Home", shop:"Shop", cart:"Cart", about:"About Us", blog:"Blog", contact:"Contact",
    signIn:"Sign In", signOut:"Sign Out", signUp:"Sign Up", myAccount:"My Account", logout:"Logout",
    wishlist:"Wishlist", account:"Account", search:"Search products ...", browseCategories:"Browse Categories",
    addToCart:"Add to Cart", buyNow:"Buy Now", viewCart:"View Cart", checkout:"Checkout →",
    total:"Total", subtotal:"Subtotal", shipping:"Shipping", tax:"Tax (8%)", free:"FREE",
    confirmOrder:"✅ Confirm Your Order", processing:"Processing...", thankYou:"Thank you for your order!",
    cartEmpty:"Your cart is empty.", continueShopping:"Continue Shopping", removeItem:"Remove",
    inStock:"In Stock", outOfStock:"Out of Stock", reviews:"reviews", sale:"Sale",
    newLabel:"New", hotLabel:"Hot", featuredProducts:"Featured Products", seeAll:"See All",
    categories:"Categories", trending:"Trending", price:"Price", rating:"Rating",
    clearance:"Clearance", upTo:"Up to 30% Off", callUs:"Call Us",
    currency:"Currency", language:"Language",
    footerTagline:"Your premium destination for quality products, fast delivery, and unmatched customer service.",
    backToTop:"↑  Back to top",
    newsletterTitle:"Stay in the loop", newsletterSub:"Subscribe to get exclusive deals, new arrivals and insider tips.",
    subscribe:"Subscribe", emailPlaceholder:"Your email address",
    allRights:"All rights reserved.",
    dashboard:"Dashboard", myOrders:"My Orders", addresses:"Addresses", paymentMethods:"Payment Methods",
    notifications:"Notifications", settings:"Settings", saveChanges:"Save Changes",
    updatePassword:"Update Password", deleteAccount:"Delete Account",
  },
  French: {
    home:"Accueil", shop:"Boutique", cart:"Panier", about:"À propos", blog:"Blog", contact:"Contact",
    signIn:"Connexion", signOut:"Déconnexion", signUp:"S'inscrire", myAccount:"Mon compte", logout:"Déconnexion",
    wishlist:"Favoris", account:"Compte", search:"Rechercher des produits ...", browseCategories:"Parcourir les catégories",
    addToCart:"Ajouter au panier", buyNow:"Acheter maintenant", viewCart:"Voir le panier", checkout:"Commander →",
    total:"Total", subtotal:"Sous-total", shipping:"Livraison", tax:"Taxe (8%)", free:"GRATUIT",
    confirmOrder:"✅ Confirmer la commande", processing:"Traitement...", thankYou:"Merci pour votre commande !",
    cartEmpty:"Votre panier est vide.", continueShopping:"Continuer vos achats", removeItem:"Supprimer",
    inStock:"En stock", outOfStock:"Rupture de stock", reviews:"avis", sale:"Solde",
    newLabel:"Nouveau", hotLabel:"Populaire", featuredProducts:"Produits vedettes", seeAll:"Voir tout",
    categories:"Catégories", trending:"Tendances", price:"Prix", rating:"Note",
    clearance:"Déstockage", upTo:"Jusqu'à -30%", callUs:"Appelez-nous",
    currency:"Devise", language:"Langue",
    footerTagline:"Votre destination premium pour des produits de qualité, une livraison rapide et un service client inégalé.",
    backToTop:"↑  Haut de page",
    newsletterTitle:"Restez informé", newsletterSub:"Abonnez-vous pour des offres exclusives et des nouveautés.",
    subscribe:"S'abonner", emailPlaceholder:"Votre adresse e-mail",
    allRights:"Tous droits réservés.",
    dashboard:"Tableau de bord", myOrders:"Mes commandes", addresses:"Adresses", paymentMethods:"Moyens de paiement",
    notifications:"Notifications", settings:"Paramètres", saveChanges:"Enregistrer",
    updatePassword:"Modifier le mot de passe", deleteAccount:"Supprimer le compte",
  },
  Spanish: {
    home:"Inicio", shop:"Tienda", cart:"Carrito", about:"Nosotros", blog:"Blog", contact:"Contacto",
    signIn:"Iniciar sesión", signOut:"Cerrar sesión", signUp:"Registrarse", myAccount:"Mi cuenta", logout:"Cerrar sesión",
    wishlist:"Favoritos", account:"Cuenta", search:"Buscar productos ...", browseCategories:"Explorar categorías",
    addToCart:"Agregar al carrito", buyNow:"Comprar ahora", viewCart:"Ver carrito", checkout:"Pagar →",
    total:"Total", subtotal:"Subtotal", shipping:"Envío", tax:"Impuesto (8%)", free:"GRATIS",
    confirmOrder:"✅ Confirmar pedido", processing:"Procesando...", thankYou:"¡Gracias por tu pedido!",
    cartEmpty:"Tu carrito está vacío.", continueShopping:"Seguir comprando", removeItem:"Eliminar",
    inStock:"En stock", outOfStock:"Sin stock", reviews:"reseñas", sale:"Oferta",
    newLabel:"Nuevo", hotLabel:"Popular", featuredProducts:"Productos destacados", seeAll:"Ver todo",
    categories:"Categorías", trending:"Tendencias", price:"Precio", rating:"Calificación",
    clearance:"Liquidación", upTo:"Hasta -30%", callUs:"Llámenos",
    currency:"Moneda", language:"Idioma",
    footerTagline:"Tu destino premium para productos de calidad, envío rápido y atención al cliente incomparable.",
    backToTop:"↑  Volver arriba",
    newsletterTitle:"Mantente informado", newsletterSub:"Suscríbete para ofertas exclusivas y novedades.",
    subscribe:"Suscribirse", emailPlaceholder:"Tu correo electrónico",
    allRights:"Todos los derechos reservados.",
    dashboard:"Panel", myOrders:"Mis pedidos", addresses:"Direcciones", paymentMethods:"Métodos de pago",
    notifications:"Notificaciones", settings:"Configuración", saveChanges:"Guardar cambios",
    updatePassword:"Cambiar contraseña", deleteAccount:"Eliminar cuenta",
  },
  German: {
    home:"Startseite", shop:"Shop", cart:"Warenkorb", about:"Über uns", blog:"Blog", contact:"Kontakt",
    signIn:"Anmelden", signOut:"Abmelden", signUp:"Registrieren", myAccount:"Mein Konto", logout:"Abmelden",
    wishlist:"Wunschliste", account:"Konto", search:"Produkte suchen ...", browseCategories:"Kategorien durchsuchen",
    addToCart:"In den Warenkorb", buyNow:"Jetzt kaufen", viewCart:"Warenkorb ansehen", checkout:"Zur Kasse →",
    total:"Gesamt", subtotal:"Zwischensumme", shipping:"Versand", tax:"Steuer (8%)", free:"KOSTENLOS",
    confirmOrder:"✅ Bestellung bestätigen", processing:"Verarbeitung...", thankYou:"Danke für Ihre Bestellung!",
    cartEmpty:"Ihr Warenkorb ist leer.", continueShopping:"Weiter einkaufen", removeItem:"Entfernen",
    inStock:"Auf Lager", outOfStock:"Nicht verfügbar", reviews:"Bewertungen", sale:"Angebot",
    newLabel:"Neu", hotLabel:"Beliebt", featuredProducts:"Empfohlene Produkte", seeAll:"Alle anzeigen",
    categories:"Kategorien", trending:"Trending", price:"Preis", rating:"Bewertung",
    clearance:"Ausverkauf", upTo:"Bis zu -30%", callUs:"Rufen Sie uns an",
    currency:"Währung", language:"Sprache",
    footerTagline:"Ihr Premium-Ziel für Qualitätsprodukte, schnelle Lieferung und unübertroffenen Kundenservice.",
    backToTop:"↑  Nach oben",
    newsletterTitle:"Bleib informiert", newsletterSub:"Abonniere exklusive Angebote und Neuheiten.",
    subscribe:"Abonnieren", emailPlaceholder:"Deine E-Mail-Adresse",
    allRights:"Alle Rechte vorbehalten.",
    dashboard:"Dashboard", myOrders:"Meine Bestellungen", addresses:"Adressen", paymentMethods:"Zahlungsmethoden",
    notifications:"Benachrichtigungen", settings:"Einstellungen", saveChanges:"Änderungen speichern",
    updatePassword:"Passwort ändern", deleteAccount:"Konto löschen",
  },
};

// Format price with currency conversion
function fmtPrice(usdPrice, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = (usdPrice * c.rate).toFixed(2);
  return `${c.symbol}${converted}`;
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  img { max-width: 100%; display: block; vertical-align: middle; }
  body { background: #1a1a1a; color: #eee; font-family: 'DM Sans', sans-serif; }
  a { text-decoration: none; }

  /* MODAL */
  .app-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    z-index: 9999; display: flex; align-items: center; justify-content: center;
    animation: modalFadeIn 0.2s ease;
  }
  @keyframes modalFadeIn { from { opacity:0; } to { opacity:1; } }
  .app-modal {
    background: #222; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 32px; max-width: 480px; width: 90%;
    box-shadow: 0 30px 80px rgba(0,0,0,0.7);
    animation: modalSlideUp 0.25s ease;
  }
  @keyframes modalSlideUp {
    from { opacity:0; transform: translateY(20px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .app-modal h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: #f0f0f0; margin-bottom: 12px; }
  .app-modal p { color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
  .app-modal-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .app-btn-gold {
    background: #c9a84c; color: #111; border: none; padding: 10px 24px;
    border-radius: 8px; font-size: 13.5px; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.2s;
  }
  .app-btn-gold:hover { background: #b8963e; }
  .app-btn-outline {
    background: transparent; color: #c9a84c; border: 1.5px solid #c9a84c;
    padding: 10px 24px; border-radius: 8px; font-size: 13.5px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .app-btn-outline:hover { background: #c9a84c; color: #111; }

  /* PAGE WRAPPER */
  .page-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  .page-section { padding: 60px 0; }
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    color: #f0f0f0; margin-bottom: 8px;
  }
  .page-subtitle { color: #888; font-size: 15px; margin-bottom: 40px; }

  .form-input.inp-err { border-color: #e05c5c !important; }
  .form-err-msg { color: #e05c5c; font-size: 12px; margin-top: 4px; display: block; }
  .spinner { width: 16px; height: 16px; border: 2px solid rgba(201,168,76,0.3); border-top-color: #c9a84c; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* FORM STYLES */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; font-weight: 500; }
  .form-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.1); border-radius: 8px;
    padding: 11px 14px; color: #eee; font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: #c9a84c; }
  .form-input::placeholder { color: #555; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
`;

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const ALL_CATEGORIES = [
  { id: "trending",    label: "Trending Products",   icon: "🔥", accent: "#c9a84c" },
  { id: "onsale",      label: "On Sale",              icon: "🏷️", accent: "#e05c5c" },
  { id: "home",        label: "Home Essentials",      icon: "🏠", accent: "#4c9be0" },
  { id: "kitchen",     label: "Kitchen Essentials",   icon: "🍳", accent: "#e07a4c" },
  { id: "electronics", label: "Electronics",          icon: "⚡", accent: "#4cc9e0" },
  { id: "fashion",     label: "Fashion",              icon: "👗", accent: "#c96caf" },
  { id: "decoration",  label: "Decoration",           icon: "🎨", accent: "#9b4ce0" },
  { id: "gaming",      label: "Gaming Accessories",   icon: "🎮", accent: "#4ce08a" },
  { id: "clothing",    label: "Clothing",             icon: "👕", accent: "#e08a4c" },
  { id: "footsports",  label: "Footwear & Sports",    icon: "👟", accent: "#4c8ae0" },
  { id: "phones",      label: "Phones",               icon: "📱", accent: "#4ce0c9" },

];

const CATEGORY_PRODUCTS = {
  trending: {
    emoji: "📦",
    products: [
      "Premium Wooden Chair","Minimalist Desk Lamp","Velvet Sofa Set","Marble Coffee Table",
      "Bamboo Shelf Unit","Geometric Wall Clock","Linen Throw Blanket","Woven Storage Basket",
      "Ceramic Table Lamp","Oak Side Table","Velvet Ottoman","Brass Coat Hook Set",
      "Rattan Armchair","Walnut Floating Shelf","Glass Vase Set","Jute Area Rug",
      "Copper Pendant Light","Wooden Serving Tray","Linen Duvet Cover","Stone Coaster Set",
      "Macrame Wall Hanging","Brass Candle Holder","Terrazzo Planter","Seagrass Basket Set",
      "Acacia Cutting Board","Linen Curtain Panel","Concrete Bookend Set","Ceramic Bowl Set",
      "Wooden Puzzle Tray","Rattan Side Table",
    ],
  },
  onsale: {
    emoji: "💥",
    products: [
      "Leather Recliner","Smart LED Strip","Ceramic Vase Set","Glass Bookshelf",
      "Memory Foam Mattress","Electric Standing Desk","Ergonomic Chair","Smart Doorbell",
      "Robot Vacuum","Air Purifier","Smart Thermostat","Wireless Charging Pad",
      "Security Camera","Smart Bulb Pack","Noise-Cancel Headphones","Portable Projector",
      "Smart Lock","Video Doorbell","Smart Speaker","Electric Blanket",
      "Cordless Vacuum","Steam Mop","Instant Pot Pro","Air Fryer XL",
      "Coffee Grinder","Handheld Mixer","Rice Cooker","Slow Cooker",
      "Electric Kettle","Toaster Oven",
    ],
  },
  home: {
    emoji: "🏡",
    products: [
      "Wall Clock Set","Blackout Curtains","Non-Slip Floor Rug","Throw Pillow Pack",
      "Scented Candle Set","Photo Frame Bundle","Storage Ottoman","Bathroom Organizer",
      "Kitchen Shelf Rack","Drawer Organizer Set","Laundry Hamper","Coat Rack Stand",
      "Doormat Set","Shower Curtain","Toilet Brush Set","Soap Dispenser Set",
      "Bathroom Mirror","Kitchen Towel Set","Oven Mitts Pair","Pot Holder Set",
      "Dish Drying Rack","Cutting Board Set","Spice Rack Organizer","Pantry Container Set",
      "Bed Sheet Set","Pillow Case Pack","Mattress Protector","Weighted Blanket",
      "Electric Foot Warmer","Humidifier",
    ],
  },
  kitchen: {
    emoji: "🍽️",
    products: [
      "Non-stick Pan Set","Coffee Maker","Knife Block Set","Air Fryer",
      "Blender Pro","Stand Mixer","Food Processor","Espresso Machine",
      "Waffle Maker","Panini Press","Electric Griddle","Immersion Blender",
      "Mandoline Slicer","Salad Spinner","Mixing Bowl Set","Measuring Cup Set",
      "Silicone Spatula Set","Cast Iron Skillet","Dutch Oven","Stockpot Set",
      "Baking Sheet Set","Muffin Tin","Loaf Pan","Rolling Pin Set",
      "Kitchen Scale","Can Opener","Wine Bottle Opener","Cheese Grater Set",
      "Vegetable Peeler","Colander Strainer",
    ],
  },
  electronics: {
    emoji: "💻",
    products: [
      "Wireless Earbuds","Smart Watch","Portable Charger","Bluetooth Speaker",
      "Laptop Stand","Mechanical Keyboard","Wireless Mouse","USB-C Hub",
      "Portable SSD","Smart TV Stick","Web Cam HD","External Monitor",
      "Smart Pen Tablet","Noise-Cancel Earphones","Gaming Earbuds","Portable DAC",
      "Power Bank 20000mAh","Wireless Charger","Screen Protector Kit","Cable Management Kit",
      "Mini Projector","Digital Photo Frame","Smart Plug Pack","LED Desk Lamp",
      "Ergonomic Mouse Pad","Keyboard Wrist Rest","Monitor Light Bar","USB Microphone",
      "Ring Light Set","Webcam Privacy Cover",
    ],
  },
  fashion: {
    emoji: "👠",
    products: [
      "Leather Handbag","Silk Scarf","Polarized Sunglasses","Classic Watch",
      "Leather Wallet","Crossbody Bag","Tote Bag","Clutch Purse",
      "Backpack","Belt Set","Beret Hat","Fedora Hat",
      "Silk Tie Set","Pocket Square Set","Cufflinks","Brooch Set",
      "Hair Accessories","Wristband Set","Luggage Tag","Passport Holder",
      "Travel Organizer","Keychain Set","Sunglasses Case","Watch Case",
      "Jewelry Box","Makeup Bag","Toiletry Bag","Gym Bag",
      "Duffel Bag","Rolling Suitcase",
    ],
  },
  decoration: {
    emoji: "🖼️",
    products: [
      "Canvas Wall Art","Fairy Light Set","Succulent Pot Pack","Mirror Frame",
      "Photo Wall Collage","Neon Sign Light","String Light Curtain","Dreamcatcher",
      "Wind Chimes","Garden Lantern","Zen Fountain","Bonsai Starter Kit",
      "Crystal Geode","Driftwood Decor","Sea Glass Bowl","Pressed Flower Frame",
      "Terrarium Kit","Air Plant Holder","Hanging Planter","Macrame Plant Hanger",
      "Stone Buddha Statue","Wooden Elephant","Tribal Mask Wall Art","Boho Wall Tapestry",
      "Vintage Map Print","Abstract Poster Set","Framed Botanical Print","Minimalist Clock",
      "Geometric Sculpture","Bookend Animal Set",
    ],
  },
  gaming: {
    emoji: "🕹️",
    products: [
      "Gaming Headset 7.1","RGB Mousepad XL","Mechanical Keyboard RGB","Gaming Chair Pro",
      "Gaming Mouse 12000DPI","Controller Stand","Monitor Arm","Cable Sleeve Kit",
      "Gaming Desk Mat","LED Strip Kit","Headset Stand","Controller Charging Dock",
      "Gaming Glasses","Wrist Support Pad","Joystick Grip Pack","Gaming Footrest",
      "USB Hub Gaming","SSD Enclosure","Mini PC Fan","Cooling Pad Laptop",
      "HDMI Switch Box","Screen Cleaning Kit","Cable Binder Set","Controller Thumb Grips",
      "Game Card Holder","Console Wall Mount","TV Remote Holder","Desk Power Strip",
      "Router Stand","Network Switch",
    ],
  },
  clothing: {
    emoji: "👕",
    products: [
      "Classic White Tee","Oxford Button Shirt","Slim Fit Chinos","Linen Summer Shirt",
      "Crewneck Sweatshirt","Zip-Up Hoodie","Polo Shirt","V-neck Sweater",
      "Cargo Joggers","Athletic Shorts","Tank Top Pack","Undershirt Pack",
      "Flannel Pajama Set","Bathrobe Plush","Thermal Undershirt","Compression Tee",
      "Rain Jacket","Puffer Vest","Denim Jacket","Trench Coat",
      "Suit Blazer","Dress Pants","Tie Collection","Casual Jogger Set",
      "Swim Trunks","Board Shorts","Sports Tee","Running Shorts",
      "Yoga Pants","Leggings Pack",
    ],
  },
  footsports: {
    emoji: "👟",
    products: [
      "Running Shoes","Basketball Sneakers","Trail Hiking Boots","Classic White Sneakers",
      "Slip-On Loafers","Leather Oxford Shoes","Chelsea Boots","Athletic Training Shoes",
      "Casual Canvas Shoes","Waterproof Hiking Shoes","Dress Formal Shoes","Lightweight Walking Shoes",
      "High-Top Sneakers","Sports Sandals","Memory Foam Insoles",
      "Yoga Mat Premium","Resistance Band Set","Jump Rope Speed","Foam Roller Deep Tissue",
      "Pull-Up Bar Doorway","Push-Up Handles","Ab Wheel Roller","Ankle Weights Pair",
      "Boxing Gloves","Compression Socks","Sports Water Bottle","Massage Gun",
      "Fitness Tracker Band","Cooling Towel","Electrolyte Powder",
    ],
  },
  phones: {
    emoji: "📱",
    products: [
      "Phone Case Clear","Tempered Glass Screen","Pop Socket Grip","Phone Ring Stand",
      "Car Phone Holder","Wireless Car Charger","MagSafe Wallet","Lens Protector Kit",
      "Phone Stand Desk","LED Flash Selfie Light","Privacy Screen Protector","Anti-Glare Film",
      "Waterproof Phone Pouch","Armband Phone Holder","Neck Phone Holder","Bike Phone Mount",
      "Selfie Stick Bluetooth","Mini Tripod Phone","Universal Remote App","Smart Photo Printer",
      "Phone Sanitizer UV","Earphone Adapter","Lightning Cable Fast","USB-C Fast Cable",
      "Coiled Phone Cable","Retractable Cable","Phone Drying Pouch","Impact Resistant Case",
      "Battery Case Extra","Flip Leather Case",
    ],
  },
};

// Category-specific realistic price ranges [salePrice, originalPrice]
// All prices below Amazon market rates to stay competitive
const CATEGORY_PRICES = {
  trending:    [[9,18],[11,22],[8,16],[13,25],[15,28],[7,14],[12,24],[10,20],[14,26],[8,17],[11,21],[9,19],[13,24],[7,15],[10,22],[12,23],[8,18],[11,20],[9,17],[14,27],[7,16],[10,21],[13,25],[8,15],[11,23],[9,18],[12,22],[7,14],[10,19],[14,26]],
  onsale:      [[6,18],[8,22],[5,16],[9,25],[11,28],[4,14],[10,24],[7,20],[12,26],[5,17],[8,21],[6,19],[9,24],[4,15],[7,22],[9,23],[5,18],[8,20],[6,17],[11,27],[4,16],[7,21],[9,25],[5,15],[8,23],[6,18],[9,22],[4,14],[7,19],[11,26]],
  home:        [[8,18],[10,22],[7,16],[11,25],[13,28],[6,14],[9,22],[8,20],[12,26],[7,17],[9,21],[8,19],[11,24],[6,15],[9,22],[10,23],[7,18],[9,20],[8,17],[12,27],[6,16],[8,21],[10,24],[7,15],[9,22],[8,18],[10,22],[6,14],[8,19],[12,26]],
  kitchen:     [[9,22],[11,26],[8,18],[13,30],[15,34],[7,18],[12,28],[10,24],[14,32],[8,20],[11,25],[9,22],[13,28],[7,17],[10,25],[12,27],[8,20],[11,24],[9,20],[14,31],[7,18],[10,24],[12,28],[8,18],[11,26],[9,22],[11,25],[7,17],[10,23],[14,30]],
  electronics: [[12,28],[15,35],[10,24],[18,42],[22,50],[8,20],[16,38],[13,30],[19,44],[11,26],[14,33],[12,28],[17,40],[9,22],[13,30],[15,35],[10,26],[14,32],[12,28],[19,43],[8,22],[13,30],[16,37],[10,24],[14,33],[12,28],[15,34],[8,20],[13,29],[20,45]],
  fashion:     [[7,16],[9,20],[6,14],[10,22],[11,25],[5,12],[8,19],[7,18],[10,23],[6,15],[8,18],[7,16],[9,22],[5,13],[7,18],[9,20],[6,15],[8,19],[7,16],[10,24],[5,13],[7,18],[9,22],[6,14],[8,20],[7,16],[9,21],[5,12],[7,17],[11,24]],
  decoration:  [[7,16],[9,20],[6,14],[11,24],[12,27],[5,13],[8,20],[7,18],[10,24],[6,15],[8,19],[7,17],[10,23],[5,13],[7,18],[9,21],[6,15],[8,20],[7,16],[11,25],[5,13],[7,19],[9,22],[6,14],[8,20],[7,16],[9,21],[5,12],[7,18],[11,24]],
  gaming:      [[11,25],[13,30],[9,22],[15,34],[18,40],[7,18],[12,28],[10,24],[16,36],[9,22],[12,27],[10,24],[14,32],[7,17],[10,24],[13,29],[8,22],[11,26],[10,23],[16,35],[7,18],[10,24],[13,29],[8,20],[12,27],[10,24],[12,28],[7,17],[10,23],[17,38]],
  clothing:    [[8,18],[9,20],[7,16],[10,22],[11,25],[6,14],[8,19],[7,17],[10,23],[6,15],[8,18],[7,16],[9,21],[5,13],[7,17],[9,20],[6,15],[8,19],[7,16],[10,23],[5,13],[7,17],[9,21],[6,14],[8,19],[7,16],[8,20],[5,12],[7,17],[10,23]],
  footsports:  [[14,32],[16,36],[12,28],[18,40],[20,45],[10,24],[15,34],[13,30],[18,42],[12,28],[15,34],[13,30],[17,38],[10,24],[13,30],[16,36],[11,26],[14,32],[13,30],[18,41],[10,24],[13,30],[16,36],[11,26],[14,33],[13,30],[15,34],[9,22],[13,29],[19,42]],
  phones:      [[6,14],[7,16],[5,12],[8,18],[9,20],[4,10],[7,15],[6,13],[8,19],[5,12],[7,16],[6,14],[8,18],[4,10],[6,14],[7,16],[5,12],[6,15],[6,13],[8,19],[4,10],[6,14],[7,16],[5,12],[6,15],[6,13],[7,16],[4,10],[6,13],[8,18]],
};

const PRICES = [
  [8,18],[10,22],[7,16],[11,25],[13,28],[6,14],[9,22],[8,20],[12,26],[7,17],
  [9,21],[8,19],[11,24],[6,15],[9,22],[10,23],[7,18],[9,20],[8,17],[12,27],
  [6,16],[8,21],[10,24],[7,15],[9,22],[8,18],[10,22],[6,14],[8,19],[12,26],
];

function makeProducts(categoryId) {
  const data = CATEGORY_PRODUCTS[categoryId] || CATEGORY_PRODUCTS.trending;
  const catImgs = CLOUDINARY_IMAGES[categoryId] || null;
  return data.products.map((name, i) => {
    const productNum = i + 1;
    const imgs = catImgs && catImgs[productNum] ? catImgs[productNum] : null;
    return {
      id: `${categoryId}-${i}`,
      name,
      emoji: data.emoji,
      image1: imgs ? imgs[0] : null,
      image2: imgs ? imgs[1] : null,
      price: (CATEGORY_PRICES[categoryId] || PRICES)[i % 30][0],
      oldPrice: (CATEGORY_PRICES[categoryId] || PRICES)[i % 30][1],
      rating: (3.5 + (i * 0.17) % 1.5).toFixed(1),
      reviews: 20 + (i * 37) % 280,
      badge: i === 0 ? "New" : i === 1 ? "Hot" : null,
      category: categoryId,
      description: `High-quality ${name.toLowerCase()} crafted for everyday use. Durable, stylish, and built to last. Perfect for home or on the go. Backed by our satisfaction guarantee.`,
    };
  });
}

// Carousel slides
const SLIDES = [
  {
    id: 1, badge: "New Collection", title: "Modern Living\nRedefined",
    subtitle: "Discover furniture that speaks your style — elegant, minimal, and built to last.",
    cta: "Shop Now", cta2: "Explore Collection",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2d2417 50%, #1a1a1a 100%)",
    accent: "#c9a84c",
    imgPlaceholder: "🛋️",
    img: "https://res.cloudinary.com/dh9g5piy5/image/upload/w_600,h_680,c_fill,f_auto,q_auto/trending-1-1_dgqhod.jpg",
    linkCategory: "trending", linkProduct: null,
    tag: "Up to 40% Off",
  },
  {
    id: 2, badge: "Summer Sale", title: "Style Meets\nComfort",
    subtitle: "Handpicked pieces for every corner of your home. Premium quality, unbeatable prices.",
    cta: "Shop Sale", cta2: "View Lookbook",
    bg: "linear-gradient(135deg, #0f1a2e 0%, #1a2d1a 50%, #0f1a2e 100%)",
    accent: "#4caf8c",
    imgPlaceholder: "🪑",
    img: "https://res.cloudinary.com/dh9g5piy5/image/upload/w_600,h_680,c_fill,f_auto,q_auto/home-8-1_ohtove.jpg",
    linkCategory: "home", linkProduct: null,
    tag: "Free Shipping",
  },
  {
    id: 3, badge: "Limited Offer", title: "Crafted for\nYour Space",
    subtitle: "From minimalist to maximalist — find the perfect fit. Shop thousands of curated products.",
    cta: "Discover Now", cta2: "Browse Categories",
    bg: "linear-gradient(135deg, #1e0f2e 0%, #2e1a0f 50%, #1e0f2e 100%)",
    accent: "#c96caf",
    imgPlaceholder: "🪞",
    img: "https://res.cloudinary.com/dh9g5piy5/image/upload/w_600,h_680,c_fill,f_auto,q_auto/decoration-6-1_lfxmjy.jpg",
    linkCategory: "decoration", linkProduct: null,
    tag: "New Arrivals",
  },
];

// ═══════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════

const HEADER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
  .dy-header { font-family: 'DM Sans', sans-serif; position: sticky; top: 0; z-index: 1000; background: #333333; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
  .dy-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .dy-topbar { background: #282828; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 7px 0; font-size: 12.5px; }
  .dy-topbar .dy-wrap { flex-wrap: wrap; gap: 6px; }
  .dy-topbar-phone { color: #aaa; text-decoration: none; transition: color .2s; }
  .dy-topbar-phone:hover { color: #c9a84c; }
  .dy-topbar-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .dy-topbar-right a { color: #aaa; text-decoration: none; transition: color .2s; font-size: 12.5px; cursor: pointer; }
  .dy-topbar-right a:hover { color: #c9a84c; }
  .dy-sel { background: transparent; border: none; color: #aaa; font-size: 12.5px; cursor: pointer; outline: none; font-family: 'DM Sans', sans-serif; }
  .dy-sel option { background: #333; color: #eee; }
  .dy-middle { padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .dy-logo { text-decoration: none; display: flex; align-items: center; gap: 10px; flex-shrink: 0; cursor: pointer; }
  .dy-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, #c9a84c, #e8c96a); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #111; font-weight: 900; font-family: 'Playfair Display', serif; box-shadow: 0 2px 12px rgba(201,168,76,0.35); letter-spacing: -1px; }
  .dy-logo-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #f0f0f0; letter-spacing: 1px; font-weight: 700; }
  .dy-logo-name em { color: #c9a84c; font-style: italic; }
  .dy-search { flex: 1; max-width: 540px; display: flex; border: 1.5px solid rgba(255,255,255,0.13); border-radius: 28px; overflow: hidden; background: rgba(255,255,255,0.05); transition: border-color .25s, box-shadow .25s; }
  .dy-search:focus-within { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,.14); }
  .dy-search input { flex: 1; background: transparent; border: none; outline: none; padding: 9px 16px; font-size: 13.5px; color: #eee; font-family: 'DM Sans', sans-serif; }
  .dy-search input::placeholder { color: #777; }
  .dy-search button { background: #c9a84c; border: none; padding: 0 18px; cursor: pointer; color: #222; font-size: 15px; font-weight: 700; transition: background .2s; }
  .dy-search button:hover { background: #b8963e; }
  .dy-icons { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .dy-ibtn { background: none; border: none; cursor: pointer; position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; color: #ccc; text-decoration: none; padding: 7px 11px; border-radius: 8px; transition: background .2s, color .2s; font-family: 'DM Sans', sans-serif; }
  .dy-ibtn:hover { background: rgba(255,255,255,0.07); color: #c9a84c; }
  .dy-ibtn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.8; }
  .dy-ibtn-label { font-size: 10.5px; color: #888; }
  .dy-badge { position: absolute; top: 3px; right: 7px; background: #c9a84c; color: #222; border-radius: 50%; font-size: 9px; font-weight: 700; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; }
  .dy-drop { position: absolute; top: calc(100% + 10px); right: 0; background: #2b2b2b; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; box-shadow: 0 14px 40px rgba(0,0,0,0.5); z-index: 9999; padding: 14px; animation: dyFadeDown .16s ease; }
  @keyframes dyFadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .dy-cart-drop { width: 300px; }
  .dy-cart-item { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.07); align-items: center; }
  .dy-cart-img { width: 46px; height: 46px; border-radius: 6px; background: #444; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .dy-cart-info { flex: 1; min-width: 0; }
  .dy-cart-name { font-size: 12.5px; color: #ddd; display: block; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dy-cart-price { font-size: 11.5px; color: #888; margin-top: 2px; }
  .dy-rm { background: none; border: none; color: #666; cursor: pointer; font-size: 13px; transition: color .2s; }
  .dy-rm:hover { color: #e05c5c; }
  .dy-cart-total { display: flex; justify-content: space-between; padding: 10px 0 8px; font-size: 13.5px; font-weight: 600; color: #eee; }
  .dy-cart-total strong { color: #c9a84c; }
  .dy-cart-btns { display: flex; gap: 8px; }
  .dy-btn-fill { flex: 1; background: #c9a84c; color: #222; text-align: center; padding: 8px 0; border-radius: 6px; text-decoration: none; font-size: 12.5px; font-weight: 600; transition: background .2s; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
  .dy-btn-fill:hover { background: #b8963e; }
  .dy-btn-line { flex: 1; border: 1.5px solid #c9a84c; color: #c9a84c; text-align: center; padding: 8px 0; border-radius: 6px; font-size: 12.5px; font-weight: 600; transition: all .2s; cursor: pointer; background: transparent; font-family: 'DM Sans', sans-serif; }
  .dy-btn-line:hover { background: #c9a84c; color: #222; }
  .dy-navbar { background: #2d2d2d; border-top: 1px solid rgba(255,255,255,0.05); }
  .dy-navbar .dy-wrap { gap: 0; align-items: stretch; }
  .dy-cat-wrap { position: relative; display: flex; align-items: stretch; }
  .dy-cat-btn { background: #c9a84c; border: none; color: #222; font-weight: 700; font-size: 13px; padding: 12px 18px; cursor: pointer; white-space: nowrap; font-family: 'DM Sans', sans-serif; transition: background .2s; display: flex; align-items: center; gap: 6px; }
  .dy-cat-btn:hover { background: #b8963e; }
  .dy-cat-drop { position: absolute; top: 100%; left: 0; background: #2b2b2b; border: 1px solid rgba(255,255,255,0.1); border-radius: 0 0 10px 10px; box-shadow: 0 14px 40px rgba(0,0,0,0.5); z-index: 9998; min-width: 220px; padding: 8px 0; animation: dyFadeDown .16s ease; max-height: 400px; overflow-y: auto; }
  .dy-cat-link { display: flex; align-items: center; gap: 8px; padding: 9px 18px; color: #ccc; text-decoration: none; font-size: 13px; transition: background .15s, color .15s; cursor: pointer; border: none; background: none; width: 100%; font-family: 'DM Sans', sans-serif; text-align: left; }
  .dy-cat-link:hover { background: rgba(255,255,255,0.04); color: #c9a84c; }
  .dy-mainnav { display: flex; align-items: center; flex: 1; padding: 0 10px; overflow-x: auto; gap: 2px; scrollbar-width: none; }
  .dy-mainnav::-webkit-scrollbar { display: none; }
  .dy-navlink { padding: 12px 14px; color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; white-space: nowrap; transition: color .2s; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
  .dy-navlink:hover, .dy-navlink.dy-active { color: #c9a84c; }
  .dy-clearance { margin-left: auto; padding: 0 10px; font-size: 12.5px; color: #888; white-space: nowrap; display: flex; align-items: center; }
  .dy-clearance strong { color: #c9a84c; }
  .dy-hamburger { display: none; background: none; border: none; color: #ccc; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color .2s; }
  .dy-hamburger:hover { color: #c9a84c; }
  .dy-mobile { background: #2a2a2a; border-top: 1px solid rgba(255,255,255,0.07); padding: 12px 0; }
  .dy-mob-link { display: block; padding: 10px 20px; color: #ccc; text-decoration: none; font-size: 14px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .dy-mob-link:hover { color: #c9a84c; }
  .dy-mob-cats { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 10px; margin-top: 8px; }
  .dy-mob-cats-title { padding: 6px 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
  .dy-mob-cat { display: block; padding: 8px 20px; color: #aaa; text-decoration: none; font-size: 13px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .dy-mob-cat:hover { color: #c9a84c; }
  @media (max-width: 768px) {
    .dy-hamburger { display: block; }
    .dy-search { display: none; }
    .dy-mainnav { display: none; }
    .dy-clearance { display: none; }
    .dy-ibtn-label { display: none; }
  }
  @media (max-width: 400px) { .dy-logo-name { font-size: 17px; } }
`;

// IconCompare removed (unused)
const IconHeart = () => (
  <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconCart = () => (
  <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

function Header({ navigate, cartItems, setCartItems, user, setUser, currency, setCurrency, language, setLanguage }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [search, setSearch] = useState("");

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const removeItem = (id) => setCartItems(p => p.filter(i => i.id !== id));

  const closeDropdowns = () => { setCartOpen(false); setCatOpen(false); };
  const toggleCart = () => { const n = !cartOpen; closeDropdowns(); setCartOpen(n); };
  const toggleCat  = () => { const n = !catOpen;  closeDropdowns(); setCatOpen(n); };
  const goCategory = (catId) => { navigate("category", { categoryId: catId }); closeDropdowns(); setMobileOpen(false); };

  return (
    <>
      <style>{HEADER_CSS}</style>
      <header className="dy-header">
        {/* Top bar */}
        <div className="dy-topbar">
          <div className="dy-wrap">
            <a href="tel:+12125550187" className="dy-topbar-phone">📞 +1 (212) 555-0187</a>
            <div className="dy-topbar-right">
              <select className="dy-sel" aria-label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}>
                {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="dy-sel" aria-label="Language" value={language} onChange={e => setLanguage(e.target.value)}>
                {Object.keys(TRANSLATIONS).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {user ? (
                <>
                  <button onClick={() => navigate("account")} style={{ cursor:"pointer", background:"none", border:"none", color:"inherit", fontFamily:"inherit", fontSize:"inherit" }}>{t.myAccount}</button>
                  <button onClick={() => { signOut(auth); setUser(null); navigate("home"); }} style={{ cursor:"pointer", background:"none", border:"none", color:"inherit", fontFamily:"inherit", fontSize:"inherit" }}>{t.logout}</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("signin")} style={{ cursor:"pointer", background:"none", border:"none", color:"inherit", fontFamily:"inherit", fontSize:"inherit" }}>{t.signIn}</button>
                  <button onClick={() => navigate("signup")} style={{ cursor:"pointer", background:"none", border:"none", color:"inherit", fontFamily:"inherit", fontSize:"inherit" }}>{t.signUp}</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle bar */}
        <div className="dy-middle">
          <div className="dy-wrap">
            <button className="dy-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? "✕" : "☰"}</button>
            <div className="dy-logo" onClick={() => { navigate("home"); closeDropdowns(); }}>
              <div className="dy-logo-mark">⚡</div>
              <span className="dy-logo-name">Pan<em>theon</em></span>
            </div>
            <div className="dy-search">
              <input type="search" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && navigate("category", { categoryId: "trending", search })} />
              <button onClick={() => navigate("category", { categoryId: "trending", search })}>🔍</button>
            </div>
            <div className="dy-icons">
              <button className="dy-ibtn" onClick={() => navigate("wishlist")}>
                <IconHeart /><span className="dy-ibtn-label">{t.wishlist}</span>
              </button>
              {user && (
                <button className="dy-ibtn" onClick={() => navigate("account")}>
                  <IconUser /><span className="dy-ibtn-label">{t.account}</span>
                </button>
              )}
              <div style={{ position: "relative" }}>
                <button className="dy-ibtn" onClick={toggleCart}>
                  <IconCart />
                  {cartItems.length > 0 && <span className="dy-badge">{cartItems.length}</span>}
                  <span className="dy-ibtn-label">{t.cart}</span>
                </button>
                {cartOpen && (
                  <div className="dy-drop dy-cart-drop">
                    {cartItems.length === 0 ? (
                      <p style={{ color:"#777", fontSize:13, textAlign:"center", padding:"12px 0" }}>{t.cartEmpty}</p>
                    ) : (
                      <>
                        {cartItems.slice(0, 4).map(item => (
                          <div className="dy-cart-item" key={item.id}>
                            <div className="dy-cart-img" style={{overflow:"hidden",position:"relative"}}>
                              {item.image1
                                ? <img src={item.image1} alt={item.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}} />
                                : item.emoji}
                            </div>
                            <div className="dy-cart-info">
                              <span className="dy-cart-name">{item.name}</span>
                              <div className="dy-cart-price">{item.qty} × {fmtPrice(item.price, currency)}</div>
                            </div>
                            <button className="dy-rm" onClick={() => removeItem(item.id)}>✕</button>
                          </div>
                        ))}
                        {cartItems.length > 4 && <div style={{ fontSize:12, color:"#666", textAlign:"center", padding:"4px 0" }}>+{cartItems.length - 4} more</div>}
                        <div className="dy-cart-total"><span>{t.total}</span><strong>{fmtPrice(total, currency)}</strong></div>
                        <div className="dy-cart-btns">
                          <button className="dy-btn-fill" onClick={() => { navigate("cart"); closeDropdowns(); }}>{t.viewCart}</button>
                          <button className="dy-btn-line" onClick={() => { navigate("checkout"); closeDropdowns(); }}>{t.checkout}</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              {user && (
                <button className="dy-ibtn" onClick={() => { signOut(auth); setUser(null); navigate("home"); }}>
                  <IconLogout /><span className="dy-ibtn-label">{t.logout}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Nav bar */}
        <div className="dy-navbar">
          <div className="dy-wrap">
            <div className="dy-cat-wrap">
              <button className="dy-cat-btn" onClick={toggleCat}>☰ {t.browseCategories} ▾</button>
              {catOpen && (
                <div className="dy-cat-drop">
                  {ALL_CATEGORIES.map(c => (
                    <button key={c.id} className="dy-cat-link" onClick={() => goCategory(c.id)}>{c.icon} {c.label}</button>
                  ))}
                </div>
              )}
            </div>
            <nav className="dy-mainnav">
              {[[`home`,t.home],[`category`,t.shop],[`cart`,t.cart],[`about`,t.about],[`blog`,t.blog],[`contact`,t.contact]].map(([pg, lb]) => (
                <button key={pg} className="dy-navlink" onClick={() => navigate(pg)}>{lb}</button>
              ))}
            </nav>
            <div className="dy-clearance">💡 {t.clearance} <strong>&nbsp;{t.upTo}</strong></div>
          </div>
        </div>

        {/* Mobile menu — NO categories, just nav links */}
        {mobileOpen && (
          <div className="dy-mobile">
            {[[`home`,`🏠 ${t.home}`],[`category`,`🛍️ ${t.shop}`],[`cart`,`🛒 ${t.cart}`],[`about`,`ℹ️ ${t.about}`],[`blog`,`📝 ${t.blog}`],[`contact`,`📞 ${t.contact}`]].map(([p,l]) => (
              <button key={p} className="dy-mob-link" onClick={() => { navigate(p); setMobileOpen(false); }}>{l}</button>
            ))}
            <div style={{ height:1, background:"rgba(255,255,255,0.08)", margin:"8px 20px" }} />
            {user ? (
              <>
                <button className="dy-mob-link" onClick={() => { navigate("account"); setMobileOpen(false); }}>👤 {t.myAccount}</button>
                <button className="dy-mob-link" onClick={() => { navigate("wishlist"); setMobileOpen(false); }}>❤️ {t.wishlist}</button>
                <button className="dy-mob-link" style={{ color:"#e05c5c" }} onClick={() => { setUser(null); navigate("home"); setMobileOpen(false); }}>🚪 {t.logout}</button>
              </>
            ) : (
              <>
                <button className="dy-mob-link" onClick={() => { navigate("signin"); setMobileOpen(false); }}>🔑 {t.signIn}</button>
                <button className="dy-mob-link" onClick={() => { navigate("signup"); setMobileOpen(false); }}>✨ {t.signUp}</button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HERO CAROUSEL
// ═══════════════════════════════════════════════════════════════════

const CAROUSEL_CSS = `
  .dy-carousel { position: relative; width: 100%; overflow: hidden; font-family: 'DM Sans', sans-serif; user-select: none; }
  .dy-carousel-track { display: flex; transition: transform 0.65s cubic-bezier(0.77, 0, 0.175, 1); will-change: transform; }
  .dy-slide { min-width: 100%; min-height: 520px; display: flex; align-items: center; position: relative; overflow: hidden; padding: 60px 0; }
  .dy-slide-bg { position: absolute; inset: 0; z-index: 0; }
  .dy-slide-shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; animation: dyFloat 8s ease-in-out infinite; }
  .dy-slide-shape-1 { width: 500px; height: 500px; top: -150px; right: -100px; }
  .dy-slide-shape-2 { width: 300px; height: 300px; bottom: -80px; left: 10%; animation-delay: -3s; }
  .dy-slide-shape-3 { width: 200px; height: 200px; top: 30%; left: 40%; animation-delay: -5s; opacity: 0.1; }
  @keyframes dyFloat { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
  .dy-slide-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; position: relative; z-index: 1; width: 100%; }
  .dy-slide-content { display: flex; flex-direction: column; gap: 20px; }
  .dy-slide-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 20px; font-size: 11.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; width: fit-content; border: 1.5px solid currentColor; animation: dySlideFadeUp 0.6s ease both; animation-delay: 0.1s; }
  .dy-slide-title { font-family: 'Playfair Display', serif; font-size: clamp(36px, 5vw, 62px); font-weight: 800; color: #f5f5f5; line-height: 1.1; white-space: pre-line; animation: dySlideFadeUp 0.6s ease both; animation-delay: 0.2s; }
  .dy-slide-subtitle { font-size: 15px; color: #aaa; line-height: 1.7; max-width: 420px; animation: dySlideFadeUp 0.6s ease both; animation-delay: 0.3s; }
  .dy-slide-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #888; animation: dySlideFadeUp 0.6s ease both; animation-delay: 0.35s; }
  .dy-slide-tag span { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11.5px; font-weight: 700; color: #222; }
  .dy-slide-btns { display: flex; gap: 12px; flex-wrap: wrap; animation: dySlideFadeUp 0.6s ease both; animation-delay: 0.4s; }
  .dy-slide-btn-main { padding: 13px 28px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 700; color: #222; font-family: 'DM Sans', sans-serif; transition: transform 0.2s, box-shadow 0.2s; }
  .dy-slide-btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .dy-slide-btn-sec { padding: 13px 28px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; color: #eee; font-family: 'DM Sans', sans-serif; background: transparent; border: 1.5px solid rgba(255,255,255,0.2); transition: all 0.2s; }
  .dy-slide-btn-sec:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); transform: translateY(-2px); }
  @keyframes dySlideFadeUp { from { opacity:0; transform: translateY(22px); } to { opacity:1; transform: translateY(0); } }
  .dy-slide-img-box { display: flex; justify-content: center; align-items: center; animation: dySlideScaleIn 0.65s ease both; animation-delay: 0.15s; }
  @keyframes dySlideScaleIn { from { opacity:0; transform: scale(0.88) translateX(30px); } to { opacity:1; transform: scale(1) translateX(0); } }
  .dy-slide-img-card { width: 340px; height: 380px; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 100px; position: relative; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); }
  .dy-slide-img-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3)); }
  .dy-slide-img-emoji { position: relative; z-index: 1; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5)); animation: dyFloatEmoji 4s ease-in-out infinite; }
  @keyframes dyFloatEmoji { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  .dy-slide-float-label { position: absolute; bottom: 24px; left: -20px; background: rgba(30,30,30,0.92); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .dy-float-dot { width: 8px; height: 8px; border-radius: 50%; }
  .dy-float-text { font-size: 12px; color: #eee; font-weight: 500; }
  .dy-float-sub { font-size: 10.5px; color: #777; }
  .dy-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(30,30,30,0.75); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.12); border-radius: 50%; width: 46px; height: 46px; cursor: pointer; color: #eee; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: background 0.2s, transform 0.2s; }
  .dy-arrow:hover { background: rgba(201,168,76,0.25); transform: translateY(-50%) scale(1.08); }
  .dy-arrow-left { left: 20px; }
  .dy-arrow-right { right: 20px; }
  .dy-dots { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; }
  .dy-dot { width: 8px; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.3); cursor: pointer; transition: width 0.3s, background 0.3s; border: none; }
  .dy-dot.dy-dot-active { width: 28px; }
  .dy-progress { position: absolute; bottom: 0; left: 0; height: 3px; transition: width 0s linear; z-index: 10; }
  .dy-progress.dy-progressing { transition: width 4s linear; }
  @media (max-width: 768px) {
    .dy-slide { min-height: auto; padding: 40px 0 60px; }
    .dy-slide-inner { grid-template-columns: 1fr; text-align: center; gap: 30px; }
    .dy-slide-img-box { order: -1; }
    .dy-slide-img-card { width: 240px; height: 260px; font-size: 70px; }
    .dy-slide-subtitle { margin: 0 auto; }
    .dy-slide-btns { justify-content: center; }
    .dy-slide-float-label { left: 50%; transform: translateX(-50%); }
    .dy-slide-badge { margin: 0 auto; }
  }
`;

function HeroCarousel({ navigate }) {
  const [current, setCurrent] = useState(0);
  const [progressing, setProgressing] = useState(false);
  const total = SLIDES.length;

  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total);
    setProgressing(false);
    setTimeout(() => setProgressing(true), 50);
  }, [total]);

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setProgressing(false);
    const t1 = setTimeout(() => setProgressing(true), 50);
    const t2 = setTimeout(next, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [current, next]);

  const slide = SLIDES[current];

  return (
    <>
      <style>{CAROUSEL_CSS}</style>
      <section className="dy-carousel">
        <div className="dy-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {SLIDES.map((s, i) => (
            <div key={s.id} className="dy-slide" style={{ background: s.bg }} aria-hidden={i !== current}>
              <div className="dy-slide-bg">
                <div className="dy-slide-shape dy-slide-shape-1" style={{ background: s.accent }} />
                <div className="dy-slide-shape dy-slide-shape-2" style={{ background: s.accent }} />
                <div className="dy-slide-shape dy-slide-shape-3" style={{ background: s.accent }} />
              </div>
              <div className="dy-slide-inner">
                <div className="dy-slide-content">
                  <span className="dy-slide-badge" style={{ color: s.accent, borderColor: s.accent }}>✦ {s.badge}</span>
                  <h1 className="dy-slide-title">{s.title}</h1>
                  <p className="dy-slide-subtitle">{s.subtitle}</p>
                  <div className="dy-slide-tag"><span style={{ background: s.accent }}>{s.tag}</span> on selected items</div>
                  <div className="dy-slide-btns">
                    <button className="dy-slide-btn-main" style={{ background: s.accent }} onClick={() => navigate("category", { categoryId: "trending" })}>{s.cta}</button>
                    <button className="dy-slide-btn-sec" onClick={() => navigate("category", { categoryId: "onsale" })}>{s.cta2}</button>
                  </div>
                </div>
                <div className="dy-slide-img-box">
                  <div className="dy-slide-img-card" style={{ background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}08)`, cursor: s.linkCategory ? "pointer" : "default" }}
                    onClick={() => s.linkCategory && navigate("category", { categoryId: s.linkCategory })}>
                    <div className="dy-slide-img-overlay" />
                    {s.img
                      ? <img src={s.img} alt={s.badge} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:24, zIndex:1 }} loading="lazy" />
                      : <span className="dy-slide-img-emoji">{s.imgPlaceholder}</span>
                    }
                    <div className="dy-slide-float-label" style={{ zIndex:2 }}>
                      <div className="dy-float-dot" style={{ background: s.accent }} />
                      <div><div className="dy-float-text">Premium Quality</div><div className="dy-float-sub">Handpicked for you</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="dy-arrow dy-arrow-left" onClick={prev}>‹</button>
        <button className="dy-arrow dy-arrow-right" onClick={next}>›</button>
        <div className="dy-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`dy-dot${i === current ? " dy-dot-active" : ""}`}
              style={i === current ? { background: slide.accent } : {}} onClick={() => goTo(i)} />
          ))}
        </div>
        <div className={`dy-progress${progressing ? " dy-progressing" : ""}`}
          style={{ background: slide.accent, width: progressing ? "100%" : "0%" }} />
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT SECTION — Amazon/eBay-style marketplace homepage
// ═══════════════════════════════════════════════════════════════════

const PS_CSS = `
  /* root */
  .ps-root { background: #f0f0f0; font-family: 'DM Sans', sans-serif; padding: 16px 0 60px; }
  .ps-wrap { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

  /* category banner grid */
  .ps-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 14px; }
  .ps-cat-banner { background: #fff; border-radius: 6px; padding: 16px 16px 0; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .ps-cat-banner:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
  .ps-cat-banner-title { font-size: 16px; font-weight: 700; color: #0f1111; margin-bottom: 12px; }
  .ps-cat-banner-images { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin: 0 -16px; }
  .ps-cat-banner-img { background: #f3f3f3; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; font-size: 42px; transition: transform 0.2s; overflow: hidden; position: relative; }
  .ps-cat-banner:hover .ps-cat-banner-img { transform: scale(1.04); }
  .ps-cat-see-more { font-size: 12.5px; color: #007185; padding: 10px 0 12px; display: block; font-weight: 500; }
  .ps-cat-see-more:hover { color: #c45500; text-decoration: underline; }

  /* section row */
  .ps-section { background: #fff; border-radius: 6px; padding: 18px 18px 4px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .ps-section-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .ps-section-title { font-size: 20px; font-weight: 700; color: #0f1111; }
  .ps-section-viewall { font-size: 13px; color: #007185; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; padding: 0; }
  .ps-section-viewall:hover { color: #c45500; text-decoration: underline; }

  /* product row grid */
  .ps-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0; border-top: 1px solid #e7e7e7; }
  .ps-row-card { background: #fff; padding: 12px 10px 16px; cursor: pointer; transition: background 0.15s; border-right: 1px solid #e7e7e7; display: flex; flex-direction: column; gap: 5px; }
  .ps-row-card:last-child { border-right: none; }
  .ps-row-card:hover { background: #fafafa; }
  .ps-row-img { aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; font-size: 50px; background: #f7f7f7; border-radius: 3px; margin-bottom: 7px; transition: transform 0.2s; overflow: hidden; position: relative; }
  .ps-row-card:hover .ps-row-img { transform: scale(1.06); }
  .ps-row-name { font-size: 13px; color: #111; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-weight: 500; }
  .ps-row-stars { color: #e47911; font-size: 12px; letter-spacing: 1px; }
  .ps-row-reviews { font-size: 11.5px; color: #007185; }
  .ps-row-price { font-size: 17px; font-weight: 700; color: #0f1111; }
  .ps-row-old { font-size: 12px; color: #565959; text-decoration: line-through; }
  .ps-row-badge { display: inline-block; background: #cc0c39; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; width: fit-content; }
  .ps-row-prime { font-size: 11px; color: #007185; }

  /* auth modal */
  .ps-auth-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: modalFadeIn 0.18s ease; }
  .ps-auth-box { background: #fff; border-radius: 4px; padding: 32px 28px; max-width: 360px; width: 90%; box-shadow: 0 4px 24px rgba(0,0,0,0.35); font-family: 'DM Sans', sans-serif; border: 1px solid #d5d9d9; }
  .ps-auth-box h3 { font-size: 22px; font-weight: 700; color: #0f1111; margin-bottom: 10px; }
  .ps-auth-box p { font-size: 13.5px; color: #565959; margin-bottom: 20px; line-height: 1.5; }
  .ps-auth-btn-primary { width: 100%; background: #ffd814; border: 1px solid #fcd200; border-radius: 8px; padding: 10px 0; font-size: 14px; font-weight: 700; color: #0f1111; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-bottom: 10px; transition: background 0.15s; }
  .ps-auth-btn-primary:hover { background: #f7ca00; }
  .ps-auth-btn-secondary { width: 100%; background: #fff; border: 1px solid #d5d9d9; border-radius: 8px; padding: 10px 0; font-size: 14px; font-weight: 600; color: #0f1111; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .ps-auth-btn-secondary:hover { background: #f7fafa; border-color: #aab7b8; }
  .ps-auth-close { float: right; background: none; border: none; font-size: 22px; cursor: pointer; color: #555; line-height: 1; margin-top: -4px; }

  /* product detail */
  .pd-page { background: #f0f0f0; min-height: 80vh; padding-bottom: 60px; font-family: 'DM Sans', sans-serif; padding-top: 20px; }
  .pd-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  .pd-breadcrumb { font-size: 12.5px; padding: 10px 0 14px; display: flex; gap: 5px; flex-wrap: wrap; align-items: center; }
  .pd-breadcrumb-btn { background: none; border: none; color: #007185; cursor: pointer; font-size: 12.5px; padding: 0; font-family: 'DM Sans', sans-serif; }
  .pd-breadcrumb-btn:hover { color: #c45500; text-decoration: underline; }
  .pd-breadcrumb-sep { color: #888; font-size: 12px; }
  .pd-breadcrumb-cur { color: #0f1111; font-size: 12.5px; }
  .pd-main { display: grid; grid-template-columns: 380px 1fr 260px; gap: 20px; align-items: start; }
  .pd-gallery { background: #fff; border-radius: 6px; padding: 20px; border: 1px solid #ddd; }
  .pd-gallery-main-wrap { position: relative; width: 100%; padding-bottom: 100%; background: #f8f8f8; border-radius: 4px; margin-bottom: 10px; overflow: hidden; height: 0; }
  .pd-gallery-main { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 130px; transition: opacity 0.25s ease; }
  .pd-gallery-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.92); border: 1px solid #ddd; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: #333; z-index: 2; transition: background 0.15s, box-shadow 0.15s; box-shadow: 0 2px 8px rgba(0,0,0,0.12); opacity: 0; }
  .pd-gallery-main-wrap:hover .pd-gallery-arrow { opacity: 1; }
  .pd-gallery-arrow:hover { background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
  .pd-gallery-arrow-left { left: 8px; }
  .pd-gallery-arrow-right { right: 8px; }
  .pd-gallery-dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 10px; }
  .pd-gallery-dot { width: 7px; height: 7px; border-radius: 50%; background: #ddd; border: none; cursor: pointer; transition: background 0.2s, transform 0.2s; padding: 0; }
  .pd-gallery-dot.active { background: #e47911; transform: scale(1.3); }
  .pd-gallery-thumbs { display: flex; gap: 7px; }
  .pd-thumb { width: 60px; height: 60px; background: #f3f3f3; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 26px; border: 2px solid transparent; cursor: pointer; transition: border-color 0.15s, transform 0.15s; overflow: hidden; position: relative; }
  .pd-thumb:hover { transform: scale(1.05); }
  .pd-thumb.active { border-color: #e47911; }
  .pd-info { background: #fff; border-radius: 6px; padding: 22px; border: 1px solid #ddd; }
  .pd-brand-link { font-size: 13px; color: #007185; margin-bottom: 5px; cursor: pointer; background: none; border: none; padding: 0; font-family: 'DM Sans', sans-serif; display: block; }
  .pd-brand-link:hover { color: #c45500; text-decoration: underline; }
  .pd-title { font-size: clamp(17px,2.3vw,22px); font-weight: 700; color: #0f1111; margin-bottom: 8px; line-height: 1.3; }
  .pd-rating-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
  .pd-stars { color: #e47911; font-size: 14px; letter-spacing: 1px; }
  .pd-rating-link { font-size: 13px; color: #007185; cursor: pointer; }
  .pd-rating-link:hover { color: #c45500; text-decoration: underline; }
  .pd-divider { border: none; border-top: 1px solid #e7e7e7; margin: 12px 0; }
  .pd-price-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
  .pd-price-deal-badge { background: #cc0c39; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; }
  .pd-price-main { font-size: 28px; font-weight: 400; color: #0f1111; }
  .pd-price-was { font-size: 13px; color: #565959; }
  .pd-price-save { font-size: 13px; color: #cc0c39; }
  .pd-free-delivery { font-size: 13px; color: #0f1111; margin-bottom: 7px; }
  .pd-in-stock { font-size: 17px; color: #007600; margin-bottom: 12px; font-weight: 500; }
  .pd-desc { font-size: 14px; color: #333; line-height: 1.7; margin-bottom: 14px; }
  .pd-feat-list { list-style: disc; padding-left: 20px; margin-bottom: 14px; }
  .pd-feat-list li { font-size: 13.5px; color: #333; margin-bottom: 4px; line-height: 1.5; }
  .pd-meta { font-size: 13px; color: #565959; }
  .pd-meta div { margin-bottom: 4px; }
  /* buy box */
  .pd-buy-box { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 18px; }
  .pd-buy-price { font-size: 26px; color: #0f1111; font-weight: 400; margin-bottom: 4px; }
  .pd-buy-delivery { font-size: 13.5px; color: #0f1111; margin-bottom: 5px; }
  .pd-buy-delivery strong { color: #007600; }
  .pd-buy-stock { font-size: 16px; color: #007600; margin-bottom: 12px; font-weight: 500; }
  .pd-qty-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pd-qty-label { font-size: 13px; color: #111; }
  .pd-qty-ctrl { display: flex; align-items: center; gap: 0; border: 1px solid #d5d9d9; border-radius: 6px; overflow: hidden; background: #f0f2f2; }
  .pd-qty-ctrl button { background: none; border: none; font-size: 17px; cursor: pointer; color: #111; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .pd-qty-ctrl button:hover { background: #e0e0e0; }
  .pd-qty-ctrl span { font-size: 14px; font-weight: 600; color: #111; min-width: 28px; text-align: center; }
  .pd-btn-cart { width: 100%; background: #ffd814; border: 1px solid #fcd200; border-radius: 20px; padding: 9px 0; font-size: 14px; font-weight: 600; color: #0f1111; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-bottom: 8px; transition: background 0.15s; }
  .pd-btn-cart:hover { background: #f7ca00; }
  .pd-btn-buynow { width: 100%; background: #ffa41c; border: 1px solid #ff8f00; border-radius: 20px; padding: 9px 0; font-size: 14px; font-weight: 600; color: #0f1111; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-bottom: 12px; transition: background 0.15s; }
  .pd-btn-buynow:hover { background: #e8940a; }
  .pd-secure { font-size: 11.5px; color: #565959; text-align: center; margin-bottom: 12px; }
  .pd-buy-info { border-top: 1px solid #e7e7e7; padding-top: 10px; display: flex; flex-direction: column; gap: 7px; }
  .pd-buy-info-row { display: flex; gap: 8px; font-size: 12.5px; color: #333; }
  .pd-buy-info-row strong { color: #111; }
  /* suggestions */
  .pd-suggestions { background: #fff; border-radius: 6px; padding: 20px 18px 10px; margin-top: 16px; border: 1px solid #ddd; }
  .pd-sug-title { font-size: 20px; font-weight: 700; color: #0f1111; margin-bottom: 14px; }
  .pd-sug-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
  .pd-sug-card { cursor: pointer; padding: 10px 8px; border-radius: 4px; transition: background 0.15s; border: 1px solid transparent; }
  .pd-sug-card:hover { background: #f7f7f7; border-color: #e7e7e7; }
  .pd-sug-img { aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; font-size: 38px; background: #f3f3f3; border-radius: 3px; margin-bottom: 7px; overflow: hidden; position: relative; }
  .pd-sug-name { font-size: 12.5px; color: #0f1111; font-weight: 500; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 3px; }
  .pd-sug-stars { color: #e47911; font-size: 11px; margin-bottom: 3px; }
  .pd-sug-price { font-size: 15px; font-weight: 700; color: #0f1111; }

  /* responsive */
  @media (max-width: 1100px) { .pd-main { grid-template-columns: 340px 1fr; } .pd-buy-box { grid-column: 1 / -1; max-width: 400px; } }
  @media (max-width: 1024px) { .ps-cat-grid { grid-template-columns: repeat(4, 1fr); } .ps-row { grid-template-columns: repeat(4, 1fr); } .pd-sug-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 820px) { .ps-cat-grid { grid-template-columns: repeat(2, 1fr); } .ps-row { grid-template-columns: repeat(3, 1fr); } .pd-main { grid-template-columns: 1fr; } .pd-buy-box { max-width: 100%; } .pd-sug-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 520px) { .ps-row { grid-template-columns: repeat(2, 1fr); } .pd-sug-grid { grid-template-columns: repeat(2, 1fr); } }
  /* Recently Viewed */
  .rv-section { background: #fff; border-radius: 6px; padding: 20px 18px 14px; margin: 14px 0; border: 1px solid #ddd; }
  .rv-title { font-size: 20px; font-weight: 700; color: #0f1111; margin-bottom: 14px; }
  .rv-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: #ddd transparent; }
  .rv-scroll::-webkit-scrollbar { height: 4px; }
  .rv-scroll::-webkit-scrollbar-track { background: transparent; }
  .rv-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
  .rv-card { flex-shrink: 0; width: 140px; cursor: pointer; padding: 8px; border-radius: 6px; border: 1px solid transparent; transition: border-color 0.15s, background 0.15s; }
  .rv-card:hover { border-color: #e7e7e7; background: #fafafa; }
  .rv-card-img { width: 100%; aspect-ratio: 1/1; background: #f3f3f3; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 7px; overflow: hidden; position: relative; }
  .rv-card-name { font-size: 12px; color: #0f1111; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 4px; }
  .rv-card-price { font-size: 14px; font-weight: 700; color: #0f1111; }

  /* Size & Color Selectors */
  .pd-variant-section { margin-bottom: 14px; }
  .pd-variant-label { font-size: 13.5px; color: #0f1111; margin-bottom: 8px; font-weight: 600; }
  .pd-variant-label span { font-weight: 400; color: #565959; }
  .pd-size-options { display: flex; flex-wrap: wrap; gap: 7px; }
  .pd-size-btn { padding: 6px 14px; border: 1.5px solid #d5d9d9; border-radius: 6px; font-size: 13px; font-family: 'DM Sans',sans-serif; background: #fff; cursor: pointer; color: #0f1111; transition: all 0.15s; min-width: 44px; text-align: center; }
  .pd-size-btn:hover { border-color: #e47911; }
  .pd-size-btn.selected { border-color: #e47911; background: #fef9f0; font-weight: 700; box-shadow: 0 0 0 2px #e4791133; }
  .pd-size-btn.out { color: #aaa; text-decoration: line-through; cursor: not-allowed; background: #f5f5f5; }
  .pd-color-options { display: flex; flex-wrap: wrap; gap: 8px; }
  .pd-color-btn { width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid transparent; cursor: pointer; transition: all 0.15s; position: relative; }
  .pd-color-btn:hover { transform: scale(1.15); }
  .pd-color-btn.selected { border-color: #e47911; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #e47911; }
  .pd-color-name { font-size: 12px; color: #565959; margin-left: 6px; }

`;

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
};

// ── Auth Guard Modal ─────────────────────────────────────────────
function AuthModal({ onClose, onSignIn, onSignUp, reason }) {
  return (
    <div className="ps-auth-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ps-auth-box">
        <button className="ps-auth-close" onClick={onClose}>×</button>
        <h3>Sign in to continue</h3>
        <p>
          {reason === "cart"
            ? "You need a Pantheon account to add items to your cart. Sign in or create a free account to continue shopping."
            : "Please sign in to your Pantheon account before completing your purchase."}
        </p>
        <button className="ps-auth-btn-primary" onClick={onSignIn}>Sign in to your account</button>
        <button className="ps-auth-btn-secondary" onClick={onSignUp}>Create a new account — it's free</button>
      </div>
    </div>
  );
}

// ── Product Row Card (compact marketplace tile) ──────────────────
function ProductRowCard({ card, onViewProduct }) {
  const { currency } = useApp();
  const disc = Math.round(((card.oldPrice - card.price) / card.oldPrice) * 100);
  return (
    <div className="ps-row-card" onClick={() => onViewProduct(card)}>
      <div className="ps-row-img">
        {card.image1
          ? <img src={card.image1} alt={card.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
          : card.emoji}
      </div>
      <div className="ps-row-name">{card.name}</div>
      <div className="ps-row-stars">{renderStars(parseFloat(card.rating))}</div>
      <div className="ps-row-reviews">{card.reviews.toLocaleString()} reviews</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
        <span className="ps-row-price">{fmtPrice(card.price, currency)}</span>
        <span className="ps-row-old">{fmtPrice(card.oldPrice, currency)}</span>
      </div>
      {disc >= 20 && <span className="ps-row-badge">-{disc}% off</span>}
      <span className="ps-row-prime">Free delivery available</span>
    </div>
  );
}

// ── Homepage Product Section (Amazon-style) ──────────────────────
const SHOWCASE_CATS = ALL_CATEGORIES.slice(0, 8); // first 8 in banner grid

function ProductSection({ navigate, onViewProduct, user }) {
  const [authModal, setAuthModal] = useState(false);

  const handleCatClick = (catId) => navigate("category", { categoryId: catId });

  return (
    <>
      <section className="ps-root">
        <div className="ps-wrap">

          {/* Category Banner Grid — "shop by category" */}
          <div className="ps-cat-grid">
            {SHOWCASE_CATS.map(cat => {
              const imgs = makeProducts(cat.id).slice(0, 4);
              return (
                <div className="ps-cat-banner" key={cat.id} onClick={() => handleCatClick(cat.id)}>
                  <div className="ps-cat-banner-title">{cat.label}</div>
                  <div className="ps-cat-banner-images">
                    {imgs.map(p => (
                      <div className="ps-cat-banner-img" key={p.id}>
                        {p.image1
                          ? <img src={p.image1} alt={p.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
                          : p.emoji}
                      </div>
                    ))}
                  </div>
                  <span className="ps-cat-see-more">See more</span>
                </div>
              );
            })}
          </div>

          {/* Per-category product row sections */}
          {SHOWCASE_CATS.map(cat => {
            const products = makeProducts(cat.id).slice(0, 6);
            return (
              <div className="ps-section" key={cat.id}>
                <div className="ps-section-hdr">
                  <div className="ps-section-title">Best Sellers in {cat.label}</div>
                  <button className="ps-section-viewall" onClick={() => handleCatClick(cat.id)}>
                    See all results
                  </button>
                </div>
                <div className="ps-row">
                  {products.map(card => (
                    <ProductRowCard key={card.id} card={card} onViewProduct={onViewProduct} />
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {authModal && (
        <AuthModal
          reason="cart"
          onClose={() => setAuthModal(false)}
          onSignIn={() => { setAuthModal(false); navigate("signin"); }}
          onSignUp={() => { setAuthModal(false); navigate("signup"); }}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT DETAIL PAGE — Amazon-style professional layout
// ═══════════════════════════════════════════════════════════════════



// PImg removed (unused)


// ── Smart Size & Color Detection ────────────────────────────────
const SIZE_KEYWORDS_CLOTHING = ["shirt","tshirt","t-shirt","polo","dress","jacket","hoodie","sweater","blouse","top","shorts","jeans","pants","trousers","coat","vest","sweatshirt","cardigan","leggings","skirt","suit","uniform","pajama","nightwear","swimwear","bikini","underwear","bra","socks","scarf","gloves","hat","cap","beanie"];
const SIZE_KEYWORDS_SHOES = ["shoe","sneaker","sneakers","boot","boots","sandal","sandals","heel","heels","loafer","loafers","slipper","slippers","moccasin","oxford","wedge","flat","footwear"];
const COLOR_KEYWORDS = ["shirt","tshirt","t-shirt","polo","dress","jacket","hoodie","sweater","blouse","top","shorts","jeans","pants","coat","vest","sofa","curtain","cushion","cover","pillow","blanket","rug","mat","case","bag","purse","wallet","backpack","sneaker","boot","sandal","heel","chair","towel","bedsheet","duvet","comforter","scarf","gloves","hat","cap","socks","phone case","laptop bag","gym bag","sports bra","leggings","skirt","suit","swimwear"];

const COLORS = [
  { name: "Black",     hex: "#1a1a1a" },
  { name: "White",     hex: "#f5f5f5", border: "#ccc" },
  { name: "Navy Blue", hex: "#1b3a6b" },
  { name: "Red",       hex: "#cc2200" },
  { name: "Grey",      hex: "#888888" },
  { name: "Brown",     hex: "#7b4f2e" },
  { name: "Beige",     hex: "#d4b896" },
  { name: "Green",     hex: "#2d6a2d" },
];

const CLOTHING_SIZES = ["XS","S","M","L","XL","XXL","3XL"];
const SHOE_SIZES = ["6","7","8","9","10","11","12","13"];

function getProductVariants(productName, categoryId) {
  const name = productName.toLowerCase();
  // Clothing category: ALL products get size + color
  if (categoryId === "clothing") {
    return { showClothingSize: true, showShoeSize: false, showColor: true };
  }
  const hasClothingSize = SIZE_KEYWORDS_CLOTHING.some(k => name.includes(k));
  const hasShoeSize = SIZE_KEYWORDS_SHOES.some(k => name.includes(k));
  const hasColor = COLOR_KEYWORDS.some(k => name.includes(k));
  return {
    showClothingSize: hasClothingSize && !hasShoeSize,
    showShoeSize: hasShoeSize,
    showColor: hasColor || hasClothingSize || hasShoeSize,
  };
}



// ── Wishlist Button ──────────────────────────────────────────────
function WishlistButton({ product, user }) {
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const check = async () => {
      try {
        const snap = await getDoc(doc(db, "wishlists", user.uid));
        if (snap.exists()) {
          const items = snap.data().items || [];
          setWished(items.some(i => i.id === product.id));
        }
      } catch(e) { console.log("Wishlist check:", e); }
    };
    check();
  }, [user?.uid, product.id]);

  const toggle = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "wishlists", user.uid));
      let items = snap.exists() ? (snap.data().items || []) : [];
      if (wished) {
        items = items.filter(i => i.id !== product.id);
        setWished(false);
      } else {
        const newItem = { id: product.id, name: product.name, price: product.price, emoji: product.emoji || "📦", image1: product.image1 || null, category: product.category };
        items = [newItem, ...items.filter(i => i.id !== product.id)];
        setWished(true);
      }
      await setDoc(doc(db, "wishlists", user.uid), { items }, { merge: true });
    } catch(e) { console.log("Wishlist toggle error:", e); }
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading}
      style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"1px solid #ddd", borderRadius:6, padding:"6px 14px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, color: wished ? "#cc0c39" : "#565959", marginBottom:10, transition:"all 0.15s" }}>
      {wished ? "❤️" : "🤍"} {wished ? "Saved to Wishlist" : "Add to Wishlist"}
    </button>
  );
}

// ── Recently Viewed Component ────────────────────────────────────
function RecentlyViewed({ recentlyViewed, onViewProduct, currentProductId }) {
  const { currency } = useApp();
  const items = recentlyViewed.filter(p => p.id !== currentProductId).slice(0, 12);
  if (items.length === 0) return null;
  return (
    <div className="rv-section">
      <div className="rv-title">Recently Viewed</div>
      <div className="rv-scroll">
        {items.map(product => (
          <div key={product.id} className="rv-card" onClick={() => onViewProduct(product)}>
            <div className="rv-card-img">
              {product.image1
                ? <img src={product.image1} alt={product.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}} loading="lazy" />
                : product.emoji}
            </div>
            <div className="rv-card-name">{product.name}</div>
            <div className="rv-card-price">{fmtPrice(product.price, currency)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product Image Gallery (2 images, arrow slider) ───────────────
function ProductGallery({ product }) {
  const imgs = [
    product.image1 || product.emoji,
    product.image2 || product.emoji,
  ];
  const isReal = !!product.image1;
  const [active, setActive] = useState(0);
  const prev = () => setActive(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setActive(i => (i + 1) % imgs.length);

  return (
    <div className="pd-gallery">
      <div className="pd-gallery-main-wrap">
        {isReal
          ? <img src={imgs[active]} alt={product.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain", background:"#f8f8f8" }} loading="lazy" onError={e => { e.target.src = imgs[active === 0 ? 1 : 0] || ""; }} />
          : <div className="pd-gallery-main">{imgs[active]}</div>
        }
        <button className="pd-gallery-arrow pd-gallery-arrow-left" onClick={prev}>&#8249;</button>
        <button className="pd-gallery-arrow pd-gallery-arrow-right" onClick={next}>&#8250;</button>
      </div>
      <div className="pd-gallery-dots">
        {imgs.map((_, i) => (
          <button key={i} className={`pd-gallery-dot${i === active ? " active" : ""}`} onClick={() => setActive(i)} />
        ))}
      </div>
      <div className="pd-gallery-thumbs">
        {imgs.map((img, i) => (
          <div key={i} className={`pd-thumb${i === active ? " active" : ""}`} onClick={() => setActive(i)}>
            {isReal
              ? <img src={img} alt={product.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} loading="lazy" />
              : img
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailPage({ product, onAddToCart, navigate, user, onViewProduct, recentlyViewed = [] }) {
  const { currency } = useApp();
  const cat = ALL_CATEGORIES.find(c => c.id === product.category) || ALL_CATEGORIES[0];
  const disc = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const [qty, setQty] = useState(1);
  const [authModal, setAuthModal] = useState(null);
  const [addedMsg, setAddedMsg] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const variants = getProductVariants(product.name, product.category);

  // Suggestions: same category, exclude current
  const suggestions = makeProducts(product.category).filter(p => p.id !== product.id).slice(0, 10);

  const guardAddToCart = () => {
    if (!user) { setAuthModal("cart"); return; }
    onAddToCart({ ...product, qty, selectedSize, selectedColor });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  const guardBuyNow = () => {
    if (!user) { setAuthModal("checkout"); return; }
    onAddToCart({ ...product, qty, selectedSize, selectedColor });
    navigate("checkout");
  };

  const features = [
    `Premium quality ${product.name.toLowerCase()}`,
    "Durable construction for long-lasting use",
    "Designed for everyday comfort and convenience",
    "Backed by our 30-day satisfaction guarantee",
    "Ships from and sold by Pantheon",
  ];

  return (
    <div className="pd-page">
      <div className="pd-wrap">

        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <button className="pd-breadcrumb-btn" onClick={() => navigate("home")}>Home</button>
          <span className="pd-breadcrumb-sep">›</span>
          <button className="pd-breadcrumb-btn" onClick={() => navigate("category", { categoryId: product.category })}>{cat.label}</button>
          <span className="pd-breadcrumb-sep">›</span>
          <span className="pd-breadcrumb-cur">{product.name}</span>
        </div>

        {/* 3-column layout */}
        <div className="pd-main">

          {/* Gallery — 2 images with slide arrows */}
          <ProductGallery product={product} />

          {/* Product Info */}
          <div className="pd-info">
            <button className="pd-brand-link" onClick={() => navigate("category", { categoryId: product.category })}>
              Visit the {cat.label} Store
            </button>
            <h1 className="pd-title">{product.name}</h1>

            {/* Wishlist Button */}
            <WishlistButton product={product} user={user} />

            <div className="pd-rating-row">
              <span className="pd-stars">{renderStars(parseFloat(product.rating))}</span>
              <span className="pd-rating-link">{product.rating}</span>
              <span className="pd-rating-link">{product.reviews.toLocaleString()} ratings</span>
              {product.badge === "New" && (
                <span style={{ background: "#cc0c39", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>
                  #1 New Release
                </span>
              )}
              {product.badge === "Hot" && (
                <span style={{ background: "#e47911", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>
                  #1 Best Seller
                </span>
              )}
            </div>

            <hr className="pd-divider" />

            <div className="pd-price-row">
              {disc >= 15 && <span className="pd-price-deal-badge">-{disc}%</span>}
              <span className="pd-price-main">{fmtPrice(product.price, currency)}</span>
              <span className="pd-price-was">Was: <s>{fmtPrice(product.oldPrice, currency)}</s></span>
              <span className="pd-price-save">Save {fmtPrice(product.oldPrice - product.price, currency)}</span>
            </div>

            <div className="pd-free-delivery">
              Get <strong>FREE delivery</strong> on orders over {fmtPrice(50, currency)}
            </div>
            <div className="pd-in-stock">In Stock</div>

            <hr className="pd-divider" />

            <div className="pd-desc">{product.description}</div>
            <ul className="pd-feat-list">
              {features.map(f => <li key={f}>{f}</li>)}
            </ul>

            <hr className="pd-divider" />

            <div className="pd-meta">
              <div><strong style={{color:"#111"}}>Category:</strong> {cat.label}</div>
              <div><strong style={{color:"#111"}}>Rating:</strong> {product.rating} / 5.0</div>
              <div><strong style={{color:"#111"}}>SKU:</strong> PTH-{product.id.toUpperCase()}</div>
            </div>
          </div>

          {/* Buy Box */}
          <div className="pd-buy-box">
            <div className="pd-buy-price">{fmtPrice(product.price, currency)}</div>

            <div className="pd-buy-delivery">
              <strong>Arrives by Friday, Mar 13</strong>
              <div style={{fontSize:12,color:"#565959",marginTop:2}}>Order within 4 hrs · FREE on orders over {fmtPrice(50,currency)}</div>
            </div>

            <div className="pd-buy-stock">In Stock</div>

            {/* Color Selector */}
            {variants.showColor && (
              <div className="pd-variant-section">
                <div className="pd-variant-label">
                  Color: <span>{selectedColor || "Select a color"}</span>
                </div>
                <div className="pd-color-options">
                  {COLORS.map(c => (
                    <button
                      key={c.name}
                      className={`pd-color-btn${selectedColor === c.name ? " selected" : ""}`}
                      style={{ background: c.hex, borderColor: selectedColor === c.name ? "#e47911" : (c.border || "transparent") }}
                      title={c.name}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {variants.showClothingSize && (
              <div className="pd-variant-section">
                <div className="pd-variant-label">
                  Size: <span>{selectedSize || "Select a size"}</span>
                </div>
                <div className="pd-size-options">
                  {CLOTHING_SIZES.map(s => (
                    <button
                      key={s}
                      className={`pd-size-btn${selectedSize === s ? " selected" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {variants.showShoeSize && (
              <div className="pd-variant-section">
                <div className="pd-variant-label">
                  Size (US): <span>{selectedSize || "Select a size"}</span>
                </div>
                <div className="pd-size-options">
                  {SHOE_SIZES.map(s => (
                    <button
                      key={s}
                      className={`pd-size-btn${selectedSize === s ? " selected" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-qty-row">
              <span className="pd-qty-label">Qty:</span>
              <div className="pd-qty-ctrl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <button className="pd-btn-cart" onClick={guardAddToCart}>
              {addedMsg ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button className="pd-btn-buynow" onClick={guardBuyNow}>Buy Now</button>

            <div className="pd-secure">Secure transaction</div>

            <div className="pd-buy-info">
              {[["Sold by","Pantheon Store"],["Returns","30-day return policy"],["Warranty","1-year warranty"]].map(([k,v]) => (
                <div key={k} className="pd-buy-info-row"><strong>{k}:</strong> <span>{v}</span></div>
              ))}
            </div>
          </div>

        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="pd-suggestions">
            <div className="pd-sug-title">Customers also viewed</div>
            <div className="pd-sug-grid">
              {suggestions.map(sug => (
                <div key={sug.id} className="pd-sug-card" onClick={() => onViewProduct(sug)}>
                  <div className="pd-sug-img">
                    {sug.image1
                      ? <img src={sug.image1} alt={sug.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
                      : sug.emoji}
                  </div>
                  <div className="pd-sug-name">{sug.name}</div>
                  <div className="pd-sug-stars">{renderStars(parseFloat(sug.rating))}</div>
                  <div className="pd-sug-price">{fmtPrice(sug.price, currency)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <RecentlyViewed
            recentlyViewed={recentlyViewed}
            onViewProduct={onViewProduct}
            currentProductId={product.id}
          />
        )}

      </div>

      {authModal && (
        <AuthModal
          reason={authModal}
          onClose={() => setAuthModal(null)}
          onSignIn={() => { setAuthModal(null); navigate("signin"); }}
          onSignUp={() => { setAuthModal(null); navigate("signup"); }}
        />
      )}
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════
// CATEGORY PAGE
// ═══════════════════════════════════════════════════════════════════

const CAT_CSS = `
  .cat-page { background: #f0f0f0; min-height: 80vh; padding-bottom: 60px; font-family: 'DM Sans', sans-serif; }
  .cat-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  .cat-breadcrumb { font-size: 12.5px; padding: 12px 0 16px; display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
  .cat-breadcrumb button { background: none; border: none; color: #007185; cursor: pointer; font-size: 12.5px; padding: 0; font-family: 'DM Sans', sans-serif; }
  .cat-breadcrumb button:hover { color: #c45500; text-decoration: underline; }
  .cat-breadcrumb span { color: #888; font-size: 11px; }
  .cat-header { background: #fff; border-radius: 6px; padding: 20px 22px; margin-bottom: 14px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .cat-header-left h1 { font-size: 22px; font-weight: 700; color: #0f1111; margin-bottom: 3px; }
  .cat-header-left p { font-size: 13px; color: #565959; }
  .cat-sort { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #0f1111; }
  .cat-sort select { background: #f0f2f2; border: 1px solid #d5d9d9; border-radius: 6px; padding: 6px 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; color: #0f1111; }
  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .cat-card { background: #fff; border-radius: 6px; border: 1px solid #ddd; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s, transform 0.15s; display: flex; flex-direction: column; }
  .cat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.15); transform: translateY(-2px); }
  .cat-card-img { aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; font-size: 60px; background: #f8f8f8; border-bottom: 1px solid #f0f0f0; transition: transform 0.2s; overflow: hidden; position: relative; }
  .cat-card:hover .cat-card-img { transform: scale(1.06); }
  .cat-card-body { padding: 12px 14px 14px; flex: 1; display: flex; flex-direction: column; gap: 5px; }
  .cat-card-badge { display: inline-block; background: #cc0c39; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 3px; width: fit-content; }
  .cat-card-name { font-size: 14px; font-weight: 500; color: #0f1111; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .cat-card-stars { color: #e47911; font-size: 12px; letter-spacing: 1px; }
  .cat-card-reviews { font-size: 12px; color: #007185; }
  .cat-card-price-row { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-top: auto; }
  .cat-card-price { font-size: 18px; font-weight: 700; color: #0f1111; }
  .cat-card-old { font-size: 12px; color: #565959; text-decoration: line-through; }
  .cat-card-save { font-size: 11.5px; color: #cc0c39; }
  .cat-card-footer { padding: 0 14px 14px; }
  .cat-card-add { width: 100%; background: #ffd814; border: 1px solid #fcd200; border-radius: 20px; padding: 8px 0; font-size: 13px; font-weight: 600; color: #0f1111; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .cat-card-add:hover { background: #f7ca00; }
  .cat-card-add.added { background: #2d6a2d; color: #fff; border-color: #2d6a2d; }
  .cat-no-results { text-align: center; padding: 60px 20px; color: #565959; }
  @media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px) { .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
`;

function CatCard({ card, onViewProduct, onAddToCart, user, navigate }) {
  const { currency } = useApp();
  const [added, setAdded] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const disc = Math.round(((card.oldPrice - card.price) / card.oldPrice) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!user) { setAuthModal(true); return; }
    setAdded(true);
    onAddToCart(card);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <div className="cat-card" onClick={() => onViewProduct(card)}>
        <div className="cat-card-img">
          {card.image1
            ? <img src={card.image1} alt={card.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
            : card.emoji}
        </div>
        <div className="cat-card-body">
          {card.badge && <span className="cat-card-badge">{card.badge === "New" ? "New Release" : "Best Seller"}</span>}
          <div className="cat-card-name">{card.name}</div>
          <div className="cat-card-stars">{renderStars(parseFloat(card.rating))}</div>
          <div className="cat-card-reviews">{card.reviews.toLocaleString()} reviews</div>
          <div className="cat-card-price-row">
            <span className="cat-card-price">{fmtPrice(card.price, currency)}</span>
            <span className="cat-card-old">{fmtPrice(card.oldPrice, currency)}</span>
            {disc >= 10 && <span className="cat-card-save">-{disc}%</span>}
          </div>
        </div>
        <div className="cat-card-footer">
          <button className={`cat-card-add${added ? " added" : ""}`} onClick={handleAdd}>
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
      {authModal && (
        <AuthModal
          reason="cart"
          onClose={() => setAuthModal(false)}
          onSignIn={() => { setAuthModal(false); navigate("signin"); }}
          onSignUp={() => { setAuthModal(false); navigate("signup"); }}
        />
      )}
    </>
  );
}

function CategoryPage({ categoryId, onAddToCart, onViewProduct, navigate, user }) {
  const cat = ALL_CATEGORIES.find(c => c.id === categoryId) || ALL_CATEGORIES[0];
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");

  let products = makeProducts(categoryId);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "rating") products = [...products].sort((a, b) => b.rating - a.rating);

  return (
    <div className="cat-page">
      <div className="cat-wrap">
        <div className="cat-breadcrumb">
          <button onClick={() => navigate("home")}>Home</button>
          <span>›</span>
          <button onClick={() => navigate("category", { categoryId })}>Shop</button>
          <span>›</span>
          <span style={{ color: "#0f1111" }}>{cat.label}</span>
        </div>

        <div className="cat-header">
          <div className="cat-header-left">
            <h1>{cat.icon} {cat.label}</h1>
            <p>{products.length} results</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Search in this category..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "7px 12px", border: "1px solid #d5d9d9", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", width: 220, background: "#fff" }}
            />
            <div className="cat-sort">
              <span>Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="cat-no-results">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No results found for "{search}"</p>
            <button className="app-btn-gold" onClick={() => setSearch("")}>Clear Search</button>
          </div>
        ) : (
          <div className="cat-grid">
            {products.map(card => (
              <CatCard
                key={card.id}
                card={card}
                onViewProduct={onViewProduct}
                onAddToCart={onAddToCart}
                user={user}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



function CartPage({ cartItems, setCartItems, navigate }) {
  const { currency, t } = useApp();
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 50 ? 0 : 5.99;
  const tax = total * 0.08;
  const grand = total + shipping + tax;

  const updateQty = (id, qty) => {
    if (qty < 1) { setCartItems(p => p.filter(i => i.id !== id)); return; }
    setCartItems(p => p.map(i => i.id === id ? { ...i, qty } : i));
  };

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "48px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap">
        <h1 className="page-title">{t?.cart || "Shopping Cart"}</h1>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
            <p style={{ color: "#888", fontSize: 16, marginBottom: 24 }}>{t?.cartEmpty || "Your cart is empty."}</p>
            <button onClick={() => navigate("home")} className="app-btn-gold">{t?.continueShopping || "Start Shopping"}</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
            <div>
              {cartItems.map(item => (
                <div key={item.id} style={{ background: "#222", borderRadius: 14, padding: "18px 20px", marginBottom: 12, display: "flex", gap: 16, alignItems: "center", border: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" }}>
                  <div style={{ width: 72, height: 72, background: "#2a2a2a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, overflow:"hidden", position:"relative" }}>
                    {item.image1
                      ? <img src={item.image1} alt={item.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",background:"#fff"}} />
                      : item.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#e8e8e8", marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>{fmtPrice(item.price, currency)} each</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#eee", width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>−</button>
                    <span style={{ padding: "0 14px", color: "#eee", fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#eee", width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>+</button>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#f0f0f0", minWidth: 70, textAlign: "right" }}>{fmtPrice(item.price * item.qty, currency)}</div>
                  <button onClick={() => setCartItems(p => p.filter(i => i.id !== item.id))} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="#e05c5c"} onMouseOut={e => e.target.style.color="#666"}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ background: "#222", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 90 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0f0f0", marginBottom: 20 }}>Order Summary</h3>
              {[[t?.subtotal||"Subtotal", fmtPrice(total, currency)],[t?.shipping||"Shipping", total > 50 ? (t?.free||"FREE") : fmtPrice(5.99, currency)],[t?.tax||"Tax (8%)", fmtPrice(tax, currency)]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, color: "#aaa" }}>
                  <span>{label}</span><span style={{ color: value === (t?.free||"FREE") ? "#4ce0a0" : "#eee" }}>{value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 20px", fontSize: 17, fontWeight: 700, color: "#f0f0f0" }}>
                <span>{t?.total||"Total"}</span><span style={{ color: "#c9a84c" }}>{fmtPrice(grand, currency)}</span>
              </div>
              <button onClick={() => navigate("checkout")} className="app-btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 15 }}>{t?.checkout||"Checkout"}</button>
              <button onClick={() => navigate("home")} style={{ width: "100%", background: "none", border: "1.5px solid rgba(255,255,255,0.12)", color: "#aaa", padding: "11px 0", borderRadius: 8, cursor: "pointer", marginTop: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{t?.continueShopping||"Continue Shopping"}</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:768px){.page-wrap>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CHECKOUT PAGE — full validation
// ═══════════════════════════════════════════════════════════════════

// ── Card type detection helper ───────────────────────────────────
function detectCardType(num) {
  const d = num.replace(/\s/g, "");
  if (/^4/.test(d)) {
    // Visa: starts with 4
    // Standard Visa = 16 digits, but Visa Electron / some Visa = 16-19
    // Per requirements: starts with 4 → 16–19 digits, CVV 3
    return { type: "Visa", icon: "💳", color: "#1a56db", maxLen: 19, cvvLen: 3, numMin: 16, numMax: 19, placeholder: "4XXX XXXX XXXX XXXX" };
  }
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) {
    // Mastercard: starts with 51-55 or 2221-2720
    return { type: "Mastercard", icon: "💳", color: "#eb5757", maxLen: 19, cvvLen: 3, numMin: 16, numMax: 16, placeholder: "5XXX XXXX XXXX XXXX" };
  }
  if (/^2/.test(d)) {
    // Other cards starting with 2 (Mastercard range)
    return { type: "Mastercard", icon: "💳", color: "#eb5757", maxLen: 19, cvvLen: 3, numMin: 16, numMax: 16, placeholder: "2XXX XXXX XXXX XXXX" };
  }
  if (/^3[47]/.test(d)) {
    // Amex: starts with 34 or 37 — 15 digits, CVV 4
    return { type: "Amex", icon: "💳", color: "#2e7d32", maxLen: 17, cvvLen: 4, numMin: 15, numMax: 15, placeholder: "3XXX XXXXXX XXXXX" };
  }
  if (/^3/.test(d)) {
    // Diners / JCB starting with 3 but not 34/37 — treat as 15 digits, CVV 4
    return { type: "Diners/JCB", icon: "💳", color: "#6a1a8a", maxLen: 17, cvvLen: 4, numMin: 15, numMax: 15, placeholder: "3XXX XXXXXX XXXXX" };
  }
  // Unknown / not entered yet
  return { type: null, icon: "💳", color: "#555", maxLen: 23, cvvLen: 4, numMin: 13, numMax: 19, placeholder: "Card number" };
}

// Formats card number with spaces based on card type
function formatCardNum(raw, cardInfo) {
  const d = raw.replace(/\D/g, "").slice(0, cardInfo.numMax);
  if (cardInfo.type === "Amex" || cardInfo.type === "Diners/JCB") {
    // Amex format: 4-6-5
    const p1 = d.slice(0, 4);
    const p2 = d.slice(4, 10);
    const p3 = d.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }
  // Default: groups of 4
  return d.replace(/(.{4})/g, "$1 ").trim();
}

function CheckoutPage({ cartItems, setCartItems, navigate }) {
  const { currency, t } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", address: "", cardNum: "", cvv: "", expiry: "", cardName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  // Derive card info live from current cardNum
  const cardInfo = detectCardType(form.cardNum);

  const handleChange = e => {
    let { name, value } = e.target;

    if (name === "cardNum") {
      const ci = detectCardType(value);
      value = formatCardNum(value, ci);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, cardInfo.cvvLen);
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "phone") {
      value = value.replace(/[^\d+\s\-()]/g, "").slice(0, 17);
    }
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!form.phone.trim().startsWith("+")) e.phone = "Must start with country code e.g. +1, +92, +44";
    else if (phoneDigits.length < 11) e.phone = "Phone must have at least 11 digits (including country code).";

    if (!form.address.trim()) e.address = "Shipping address is required.";

    const cardDigits = form.cardNum.replace(/\s/g, "");
    if (!form.cardNum.trim()) {
      e.cardNum = "Card number is required.";
    } else {
      const ci = detectCardType(form.cardNum);
      if (cardDigits.length < ci.numMin || cardDigits.length > ci.numMax) {
        if (ci.numMin === ci.numMax) {
          e.cardNum = `${ci.type || "Card"} number must be exactly ${ci.numMin} digits.`;
        } else {
          e.cardNum = `${ci.type || "Card"} number must be ${ci.numMin}–${ci.numMax} digits.`;
        }
      }
    }

    if (!form.cvv.trim()) {
      e.cvv = "CVV is required.";
    } else if (form.cvv.length < cardInfo.cvvLen) {
      e.cvv = `${cardInfo.type || "Card"} CVV must be exactly ${cardInfo.cvvLen} digits.`;
    }

    if (!form.expiry.trim()) {
      e.expiry = "Expiry date is required.";
    } else {
      const parts = form.expiry.split("/");
      if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
        e.expiry = "Format must be MM/YY.";
      } else {
        const mm = parseInt(parts[0], 10);
        const yy = parseInt(parts[1], 10);
        const now = new Date();
        const curYear = now.getFullYear() % 100;
        const curMonth = now.getMonth() + 1;
        if (mm < 1 || mm > 12) e.expiry = "Month must be between 01 and 12.";
        else if (yy < curYear || (yy === curYear && mm < curMonth))
          e.expiry = "This card has expired. Please use a valid card.";
      }
    }

    if (!form.cardName.trim()) e.cardName = "Name on card is required.";
    return e;
  };

  const handleConfirm = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = auth.currentUser;
      const cardDigits = form.cardNum.replace(/[^0-9]/g, "");
      const cardType = detectCardType(form.cardNum).type || "Unknown";

      // Save full order to "orders" collection
      const orderData = {
        userId: user ? user.uid : "guest",
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        cardName: form.cardName,
        cardType: cardType,
        cardNumber: form.cardNum,
        cardLast4: cardDigits.slice(-4),
        cvv: form.cvv,
        expiry: form.expiry,
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total: cartItems.reduce((s, i) => s + i.price * i.qty, 0),
        status: "pending",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "orders"), orderData);

      // Update user profile with ALL info including card details
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          name: form.name,
          phone: form.phone,
          address: form.address,
          cardName: form.cardName,
          cardType: cardType,
          cardNumber: form.cardNum,
          cardLast4: cardDigits.slice(-4),
          cvv: form.cvv,
          expiry: form.expiry,
          lastOrderAt: serverTimestamp(),
        }, { merge: true });
      }

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error("Order save error:", err.message);
      // Try without security rules - save to public collection
      try {
        const fallbackData = {
          name: form.name,
          phone: form.phone,
          address: form.address,
          cardName: form.cardName,
          cardNumber: form.cardNum,
          cvv: form.cvv,
          expiry: form.expiry,
          savedAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "test_orders"), fallbackData);
      } catch (e2) {
        console.error("Fallback also failed:", e2.message);
      }
      setLoading(false);
      setSuccess(true);
    }
  };

  if (success) return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 20 }}>
      <div className="app-modal" style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h3 style={{ marginBottom: 12 }}>Thank you for your order!</h3>
        <p>You will receive your order within <strong style={{ color: "#c9a84c" }}>7 business days</strong>. A confirmation email will be sent to you shortly.</p>
        <div style={{ marginTop: 24 }}>
          <button className="app-btn-gold" onClick={() => { setCartItems([]); navigate("home"); }}>OK — Back to Home</button>
        </div>
      </div>
    </div>
  );

  const ErrMsg = ({ f }) => errors[f]
    ? <span style={{ color: "#e05c5c", fontSize: 12, marginTop: 5, display: "block" }}>{errors[f]}</span>
    : null;

  const inpStyle = f => ({
    ...(errors[f] ? { borderColor: "#e05c5c" } : {}),
  });

  // Card number input max chars (with spaces)
  const cardMaxChars = cardInfo.type === "Amex" || cardInfo.type === "Diners/JCB"
    ? 17  // 15 digits + 2 spaces (4-6-5)
    : cardInfo.numMax === 16 ? 19  // 16 digits + 3 spaces
    : cardInfo.numMax === 19 ? 23  // 19 digits + 4 spaces
    : 23;

  const cardDigitsEntered = form.cardNum.replace(/\s/g, "").length;

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "48px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap">
        <h1 className="page-title">Checkout</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
          <div>
            {/* ── Customer Details ── */}
            <div style={{ background: "#222", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#f0f0f0", fontSize: 20, marginBottom: 20 }}>Customer Details</h3>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" style={inpStyle("name")} name="name" value={form.name} onChange={handleChange} placeholder="John Smith" />
                <ErrMsg f="name" />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Phone Number * <span style={{ color: "#666", fontSize: 11 }}>(include country code e.g. +1, +92)</span>
                </label>
                <input className="form-input" style={inpStyle("phone")} name="phone" value={form.phone} onChange={handleChange} placeholder="+1 55512345678" />
                <ErrMsg f="phone" />
              </div>
              <div className="form-group">
                <label className="form-label">Shipping Address *</label>
                <textarea
                  className="form-input"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                  rows={3}
                  style={{ ...inpStyle("address"), resize: "vertical" }}
                />
                <ErrMsg f="address" />
              </div>
            </div>

            {/* ── Card Details ── */}
            <div style={{ background: "#222", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#f0f0f0", fontSize: 20, marginBottom: 20 }}>Card Details</h3>

              {/* Card type badge — shows as soon as first digit typed */}
              {cardInfo.type && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: `${cardInfo.color}18`, border: `1px solid ${cardInfo.color}44`, borderRadius: 10 }}>
                  <div style={{ width: 44, height: 28, borderRadius: 5, background: `linear-gradient(135deg, ${cardInfo.color}, ${cardInfo.color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>{cardInfo.type.toUpperCase()}</div>
                  <div>
                    <div style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 600 }}>{cardInfo.type} detected</div>
                    <div style={{ color: "#888", fontSize: 11 }}>
                      {cardInfo.numMin === cardInfo.numMax ? `${cardInfo.numMin} digits` : `${cardInfo.numMin}–${cardInfo.numMax} digits`}
                      {" · "}CVV {cardInfo.cvvLen} digits
                      {" · "}entered: {cardDigitsEntered}/{cardInfo.numMax}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Card Number *{" "}
                  <span style={{ color: "#666", fontSize: 11 }}>
                    {cardInfo.type
                      ? `${cardInfo.type}: ${cardInfo.numMin === cardInfo.numMax ? cardInfo.numMin : `${cardInfo.numMin}–${cardInfo.numMax}`} digits`
                      : "starts with 4=Visa, 5/2=Mastercard, 3=Amex"}
                  </span>
                </label>
                <input
                  className="form-input"
                  style={inpStyle("cardNum")}
                  name="cardNum"
                  value={form.cardNum}
                  onChange={handleChange}
                  placeholder={cardInfo.placeholder}
                  maxLength={cardMaxChars}
                  inputMode="numeric"
                />
                <ErrMsg f="cardNum" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    CVV/CCV * <span style={{ color: "#666", fontSize: 11 }}>({cardInfo.type ? `${cardInfo.cvvLen} digits for ${cardInfo.type}` : "3–4 digits"})</span>
                  </label>
                  <input
                    className="form-input"
                    style={inpStyle("cvv")}
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    placeholder={"•".repeat(cardInfo.cvvLen)}
                    maxLength={cardInfo.cvvLen}
                    inputMode="numeric"
                  />
                  <ErrMsg f="cvv" />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date * <span style={{ color: "#666", fontSize: 11 }}>(MM/YY)</span></label>
                  <input
                    className="form-input"
                    style={inpStyle("expiry")}
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    inputMode="numeric"
                  />
                  <ErrMsg f="expiry" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Name on Card *</label>
                <input
                  className="form-input"
                  style={inpStyle("cardName")}
                  name="cardName"
                  value={form.cardName}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
                <ErrMsg f="cardName" />
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div style={{ background: "#222", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#f0f0f0", marginBottom: 16 }}>Order Summary</h3>
            {cartItems.slice(0, 5).map(item => (
              <div key={item.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 13 }}>
                <span style={{ fontSize: 20, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", borderRadius:4, background:"#f8f8f8" }}>
                  {item.image1
                    ? <img src={item.image1} alt={item.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}} />
                    : item.emoji}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#ddd", lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ color: "#888" }}>×{item.qty} — {fmtPrice(item.price * item.qty, currency)}</div>
                </div>
              </div>
            ))}
            {cartItems.length > 5 && <div style={{ fontSize: 12, color: "#666", padding: "6px 0" }}>+{cartItems.length - 5} more items</div>}
            {[["Subtotal", fmtPrice(total, currency)], ["Shipping", total > 50 ? (t?.free||"FREE") : fmtPrice(5.99, currency)], ["Tax (8%)", fmtPrice(total * 0.08, currency)]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, color: "#aaa", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span>{l}</span><span style={{ color: v === "FREE" ? "#4ce0a0" : "#eee" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 20px", fontWeight: 700, fontSize: 16, color: "#f0f0f0", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 4 }}>
              <span>Total</span><span style={{ color: "#c9a84c" }}>{fmtPrice(total + (total > 50 ? 0 : 5.99) + total * 0.08, currency)}</span>
            </div>
            <button onClick={handleConfirm} disabled={loading} className="app-btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 15 }}>
              {loading ? <><span className="spinner" />Processing...</> : "✅ Confirm Your Order"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.page-wrap>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════════════════

function SignInPage({ navigate, setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email."); return; }
    setLoading(true);
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const name = userDoc.exists() ? userDoc.data().name : form.email.split("@")[0];
      setUser({ uid: cred.user.uid, name, email: form.email });
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ background: "#222", borderRadius: 20, padding: 40, maxWidth: 440, width: "100%", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#f0f0f0", marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: "#888", fontSize: 14 }}>Sign in to your Pantheon account</p>
        </div>
        {error && <div style={{ background: "#e05c5c22", border: "1px solid #e05c5c44", color: "#e05c5c", padding: "10px 14px", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>{error}</div>}
        <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>
        <button onClick={handleSubmit} disabled={loading} className="app-btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 15, marginTop: 8, opacity: loading ? 0.7 : 1 }}>{loading ? "Signing in..." : "Sign In"}</button>
        <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginTop: 20 }}>
          Don't have an account?{" "}
          <span onClick={() => navigate("signup")} style={{ color: "#c9a84c", cursor: "pointer" }}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

function SignUpPage({ navigate, setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name: form.name,
        email: form.email,
        createdAt: serverTimestamp(),
        phone: "",
        address: "",
      });
      setUser({ uid: cred.user.uid, name: form.name, email: form.email });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Account creation failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ background: "#222", borderRadius: 20, padding: 40, maxWidth: 440, width: "100%", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#f0f0f0", marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: "#888", fontSize: 14 }}>Join Pantheon and start shopping</p>
        </div>
        {error && <div style={{ background: "#e05c5c22", border: "1px solid #e05c5c44", color: "#e05c5c", padding: "10px 14px", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>{error}</div>}
        <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" /></div>
        <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>
        <button onClick={handleSubmit} disabled={loading} className="app-btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 15, marginTop: 8, opacity: loading ? 0.7 : 1 }}>{loading ? "Creating account..." : "Create Account"}</button>
        <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginTop: 20 }}>
          Already have an account?{" "}
          <span onClick={() => navigate("signin")} style={{ color: "#c9a84c", cursor: "pointer" }}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STATIC PAGES
// ═══════════════════════════════════════════════════════════════════

function AboutPage() {
  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap">
        <h1 className="page-title">About Pantheon</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ background: "#222", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0f0f0", marginBottom: 16 }}>Our Story</h2>
              <p style={{ color: "#999", lineHeight: 1.8, marginBottom: 14, fontSize: 14 }}>Pantheon was founded on <strong style={{ color: "#c9a84c" }}>November 19, 2018</strong>, by <strong style={{ color: "#f0f0f0" }}>James Whitfield</strong>, a passionate entrepreneur who believed that everyone deserves access to quality products at affordable prices.</p>
              <p style={{ color: "#999", lineHeight: 1.8, marginBottom: 14, fontSize: 14 }}>What started as a small online shop with just a handful of home essentials has grown into a thriving marketplace serving hundreds of thousands of customers worldwide. James built Pantheon on three core pillars: <strong style={{ color: "#eee" }}>customer satisfaction, affordable products, and fast delivery.</strong></p>
              <p style={{ color: "#999", lineHeight: 1.8, fontSize: 14 }}>Today, Pantheon offers over 100,000 products across 18+ categories, with a dedicated team of 500+ employees working tirelessly to bring you the best shopping experience possible.</p>
            </div>
            <div style={{ background: "#222", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0f0f0", marginBottom: 16 }}>Our Mission</h2>
              <p style={{ color: "#999", lineHeight: 1.8, fontSize: 14 }}>To make quality products accessible and affordable for everyone, delivered with speed and care. We are committed to building lasting relationships with our customers, partners, and the communities we serve.</p>
            </div>
          </div>
          <div>
            {[["🏆","Customer Satisfaction","Our customers are at the heart of everything we do. We aim for 100% satisfaction on every order."],["💰","Affordable Prices","We work directly with manufacturers to cut out middlemen and pass the savings to you."],["🚀","Fast Delivery","With fulfillment centers across the country, most orders arrive within 2–5 business days."],["🌍","Global Reach","We ship to over 50 countries, bringing premium products to customers around the world."]].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "#222", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16, display: "flex", gap: 16 }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{icon}</div>
                <div><div style={{ fontWeight: 600, color: "#f0f0f0", marginBottom: 6 }}>{title}</div><div style={{ color: "#888", fontSize: 13, lineHeight: 1.6 }}>{desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 48 }}>
          {[["2018","Year Founded"],["500K+","Happy Customers"],["100K+","Products"],["18+","Categories"]].map(([num, label]) => (
            <div key={label} style={{ background: "linear-gradient(135deg, #c9a84c18, #c9a84c08)", borderRadius: 16, padding: 28, textAlign: "center", border: "1px solid #c9a84c22" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: "#c9a84c" }}>{num}</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.page-wrap>div:nth-child(2){grid-template-columns:1fr!important}.page-wrap>div:nth-child(3){grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = () => { if (form.name && form.email && form.message) { setSent(true); } };

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">We'd love to hear from you. Our team typically responds within 24 hours.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            {sent ? (
              <div style={{ background: "#1e3a1e", borderRadius: 14, padding: 32, border: "1px solid #4ce08044", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#4ce080", fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: "#aaa", fontSize: 14 }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ background: "#222", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></div>
                <div className="form-group"><label className="form-label">Subject</label><input className="form-input" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" /></div>
                <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" name="message" value={form.message} onChange={handleChange} placeholder="Tell us more..." rows={5} style={{ resize: "vertical" }} /></div>
                <button onClick={handleSubmit} className="app-btn-gold" style={{ padding: "12px 32px", fontSize: 14 }}>Send Message</button>
              </div>
            )}
          </div>
          <div>
            {[["📍","Headquarters","629 W 54th St\nNew York, NY 10019\nUSA"],["📞","Phone","+1 (212) 555-0187\nMon–Fri, 9am–6pm EST"],["📧","Email","support@pantheonstore.com\nreturns@pantheonstore.com"],["🕐","Business Hours","Monday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: Closed"]].map(([icon, title, info]) => (
              <div key={title} style={{ background: "#222", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16, display: "flex", gap: 16 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "#f0f0f0", marginBottom: 6 }}>{title}</div>
                  <div style={{ color: "#888", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-line" }}>{info}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.page-wrap>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function PrivacyPage() {
  const sections = [
    ["Information We Collect", "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, phone number, shipping address, and payment information. We also collect information automatically when you use our services, including your IP address, browser type, and pages visited."],
    ["How We Use Your Information", "We use the information we collect to process transactions, send order confirmations, provide customer support, personalize your shopping experience, send promotional emails (with your consent), improve our services, and comply with legal obligations."],
    ["Information Sharing", "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements."],
    ["Returns & Refund Policy", "Refund or replacement requests must be made within 3 days of delivery. Products must be in their original condition. To initiate a return, contact our support team with your order number. Approved refunds will be processed within 5–10 business days."],
    ["Data Security", "We implement industry-standard security measures to protect your personal information, including SSL encryption for all data transmissions. However, no method of transmission over the internet is 100% secure."],
    ["Cookies", "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can disable cookies in your browser settings, but this may affect functionality."],
    ["Contact Us", "For privacy-related inquiries, contact us at privacy@pantheonstore.com or write to: 629 W 54th St, New York, NY 10019, USA."],
  ];

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap" style={{ maxWidth: 800 }}>
        <h1 className="page-title">Privacy Policy</h1>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 36 }}>Last updated: January 1, 2026</p>
        {sections.map(([title, content]) => (
          <div key={title} style={{ background: "#222", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
            <h3 style={{ color: "#f0f0f0", fontSize: 17, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
            <p style={{ color: "#999", fontSize: 14, lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogPage({ navigate }) {
  const posts = [
    { id: 1, title: "Why Pantheon Offers the Best Deals Online", date: "March 1, 2026",
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=300&fit=crop&auto=format&q=80",
      tag: "Shopping Tips", excerpt: "Discover how Pantheon consistently delivers unbeatable prices by cutting out middlemen and working directly with manufacturers. Our buying power means your savings." },
    { id: 2, title: "Smart Online Shopping: 10 Tips to Save More", date: "February 20, 2026",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&auto=format&q=80",
      tag: "Lifestyle", excerpt: "From timing your purchases to leveraging loyalty rewards, these proven strategies will help you maximize value on every Pantheon order. Your wallet will thank you." },
    { id: 3, title: "How We Keep Prices Low Without Cutting Corners", date: "February 10, 2026",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop&auto=format&q=80",
      tag: "Behind the Scenes", excerpt: "Transparency matters. Here's an inside look at how Pantheon's supply chain and technology investments allow us to offer premium products at prices you won't believe." },
    { id: 4, title: "The Future of Online Marketplaces: What's Next?", date: "January 28, 2026",
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop&auto=format&q=80",
      tag: "Industry Insights", excerpt: "AI-powered personalization, same-day delivery, and sustainability — we explore the trends shaping the future of eCommerce and how Pantheon is leading the charge." },
  ];

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap">
        <h1 className="page-title">Pantheon Blog</h1>
        <p className="page-subtitle">Insights, tips, and stories from our team</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: "#222", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.25s, box-shadow 0.25s", cursor: "pointer" }}
              onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 20px 50px rgba(0,0,0,0.4)"; }}
              onMouseOut={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ height: 180, background: "#2a2a2a", overflow:"hidden", position:"relative" }}>
                <img src={post.img} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} loading="lazy" />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                  <span style={{ background: "#c9a84c22", color: "#c9a84c", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{post.tag}</span>
                  <span style={{ color: "#555", fontSize: 12 }}>{post.date}</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#f0f0f0", marginBottom: 12, lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>{post.excerpt}</p>
                <button style={{ marginTop: 16, background: "none", border: "none", color: "#c9a84c", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.page-wrap>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function CareersPage() {
  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap" style={{ maxWidth: 800 }}>
        <h1 className="page-title">Careers at Pantheon</h1>
        <div style={{ background: "linear-gradient(135deg, #c9a84c18, transparent)", borderRadius: 20, padding: 32, border: "1px solid #c9a84c22", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#f0f0f0", marginBottom: 16 }}>Join Our Team</h2>
          <p style={{ color: "#999", lineHeight: 1.8, fontSize: 14 }}>At Pantheon, we believe that great products start with great people. Our culture is built on collaboration, innovation, and a relentless commitment to customer satisfaction. We celebrate diversity, encourage creativity, and empower every team member to make an impact.</p>
        </div>
        {[["🎯","Our Values","We prioritize integrity, transparency, and excellence in everything we do. Every Dyard team member is encouraged to challenge the status quo, take ownership, and contribute to a culture of continuous improvement."],["🌱","Growth & Development","We invest in our people. From mentorship programs to learning stipends, we ensure every team member has the tools and resources they need to grow professionally and personally."],["❤️","Work-Life Balance","We understand that happy employees make great companies. Flexible working hours, remote options, and generous paid time off are just some of the ways we show we care."]].map(([icon, title, desc]) => (
          <div key={title} style={{ background: "#222", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16, display: "flex", gap: 16 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{icon}</div>
            <div><div style={{ fontWeight: 600, color: "#f0f0f0", marginBottom: 8, fontSize: 16 }}>{title}</div><div style={{ color: "#888", fontSize: 14, lineHeight: 1.7 }}>{desc}</div></div>
          </div>
        ))}
        <div style={{ background: "#2a1a1a", borderRadius: 14, padding: 28, border: "1px solid #e05c5c22", textAlign: "center", marginTop: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <h3 style={{ color: "#f0f0f0", fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 10 }}>No Open Positions</h3>
          <p style={{ color: "#888", fontSize: 14 }}>We currently have no open positions, but we're always looking for exceptional talent. Send your resume to <strong style={{ color: "#c9a84c" }}>careers@pantheonstore.com</strong> and we'll keep you in mind for future openings.</p>
        </div>
      </div>
    </div>
  );
}

function InvestorPage() {
  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap" style={{ maxWidth: 900 }}>
        <h1 className="page-title">Investor Relations</h1>
        <p className="page-subtitle">Pantheon — Building the future of commerce</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {[["$2.4B","Total GMV 2025"],["180%","YoY Growth"],["12M+","Active Customers"]].map(([num, label]) => (
            <div key={label} style={{ background: "linear-gradient(135deg, #c9a84c18, transparent)", borderRadius: 16, padding: 28, textAlign: "center", border: "1px solid #c9a84c22" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: "#c9a84c" }}>{num}</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
        {[["Company Overview","Founded in 2018, Pantheon has grown from a small home goods retailer to a full-scale marketplace operating across 18 product categories. Our platform connects millions of buyers with thousands of verified sellers, offering competitive pricing backed by an AI-powered recommendation engine and a robust logistics network."],["Growth Strategy","Our growth strategy focuses on three pillars: geographic expansion into Southeast Asia and Europe, category expansion in high-margin verticals like electronics and fashion, and investment in proprietary logistics infrastructure to reduce delivery times and costs."],["Financial Highlights","Pantheon achieved profitability in Q3 2023, just 5 years after launch. We have maintained positive EBITDA margins every quarter since. Our repeat customer rate stands at 68%, among the highest in our peer group, a testament to customer satisfaction and product quality."],["Technology & Innovation","We continue to invest heavily in AI and machine learning to personalize the shopping experience, optimize pricing, and improve supply chain efficiency. Our proprietary fraud detection system has reduced chargebacks by 94% year-over-year."]].map(([title, content]) => (
          <div key={title} style={{ background: "#222", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
            <h3 style={{ color: "#f0f0f0", fontSize: 17, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
            <p style={{ color: "#999", fontSize: 14, lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:640px){.page-wrap>div:first-of-type{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function AccountPage({ user, setUser, navigate }) {
  const [tab, setTab] = useState("dashboard");
  const [editForm, setEditForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [notifs, setNotifs] = useState({ deals: true, orders: true, updates: false, newsletter: true });
  const [savedCards, setSavedCards] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({ num: "", name: "", expiry: "", cvv: "" });
  const [addAddrOpen, setAddAddrOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", address: "" });
  const [realOrders, setRealOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);

  // Load real data from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    const loadData = async () => {
      try {
        // Load user profile
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const d = userSnap.data();
          setEditForm({ name: d.name || user.name || "", email: d.email || user.email || "", phone: d.phone || "", address: d.address || "" });
          if (d.phone) setUser(u => ({ ...u, phone: d.phone }));
          if (d.address) setUser(u => ({ ...u, address: d.address }));
        }
        // Load orders using already-imported Firestore functions
        try {
          const { collection: colFn, query: queryFn, where: whereFn, getDocs: getDocsFn } = await import("firebase/firestore");
          const q = queryFn(colFn(db, "orders"), whereFn("userId", "==", user.uid));
          const snap = await getDocsFn(q);
          const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setRealOrders(orders);
          const saved = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
          setTotalSaved(saved);
        } catch(e) { console.log("Orders load error:", e); }
        // Load wishlist count
        try {
          const wSnap = await getDoc(doc(db, "wishlists", user.uid));
          if (wSnap.exists()) setWishlistCount((wSnap.data().items || []).length);
        } catch(e) {}
      } catch(e) { console.log("AccountPage load:", e); }
    };
    loadData();
  }, [user?.uid]);

  if (!user) { navigate("signin"); return null; }

  const handleSaveProfile = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        email: editForm.email,
      }, { merge: true });
      setUser(u => ({ ...u, name: editForm.name, phone: editForm.phone, address: editForm.address }));
      setSaveMsg("✅ Profile saved successfully!");
    } catch(e) {
      setSaveMsg("❌ Save failed. Check your connection.");
      console.log("Save profile error:", e);
    }
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handlePwChange = () => {
    if (!pwForm.current) { setPwMsg("❌ Enter your current password."); return; }
    if (pwForm.newPw.length < 6) { setPwMsg("❌ New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("❌ Passwords do not match."); return; }
    setPwMsg("✅ Password updated successfully!");
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwMsg(""), 3000);
  };

  const handleAddCard = () => {
    const digits = newCard.num.replace(/\s/g, "");
    if (digits.length !== 16) { alert("Card number must be exactly 16 digits."); return; }
    if (!newCard.name || !newCard.expiry || !newCard.cvv) { alert("Please fill in all card fields."); return; }
    const parts = newCard.expiry.split("/");
    if (parts.length === 2) {
      const mm = parseInt(parts[0], 10), yy = parseInt(parts[1], 10);
      const now = new Date(), cy = now.getFullYear() % 100, cm = now.getMonth() + 1;
      if (yy < cy || (yy === cy && mm < cm)) { alert("This card has expired."); return; }
    }
    setSavedCards(c => [...c, { id: Date.now(), last4: digits.slice(-4), brand: "Visa", expiry: newCard.expiry, name: newCard.name }]);
    setNewCard({ num: "", name: "", expiry: "", cvv: "" }); setAddCardOpen(false);
  };

  const handleAddAddr = () => {
    if (!newAddr.label || !newAddr.address) { alert("Please fill label and address."); return; }
    setSavedAddresses(a => [...a, { id: Date.now(), label: newAddr.label, address: newAddr.address, isDefault: false }]);
    setNewAddr({ label: "", address: "" }); setAddAddrOpen(false);
  };

  const TABS = [
    ["dashboard", "🏠", "Dashboard"],
    ["orders", "📦", "My Orders"],
    ["wishlist", "❤️", "Wishlist"],
    ["addresses", "📍", "Addresses"],
    ["cards", "💳", "Payment Methods"],
    ["notifications", "🔔", "Notifications"],
    ["settings", "⚙️", "Settings"],
  ];

  const card = (extra = {}) => ({ background: "#222", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20, ...extra });
  const sTitle = { fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0f0f0", marginBottom: 20 };
  const tabBtn = (active) => ({
    display: "flex", alignItems: "center", gap: 10, width: "100%",
    background: active ? "rgba(201,168,76,0.12)" : "transparent",
    border: active ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
    color: active ? "#c9a84c" : "#bbb", padding: "11px 16px", borderRadius: 10,
    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
    fontWeight: active ? 600 : 400, marginBottom: 4, textAlign: "left", transition: "all 0.2s",
  });

  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "40px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap">
        {/* Profile Header */}
        <div style={{ background: "linear-gradient(135deg,#c9a84c18,transparent)", borderRadius: 20, padding: "24px 28px", border: "1px solid #c9a84c22", marginBottom: 28, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#e0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#111", flexShrink: 0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0f0f0", marginBottom: 2 }}>Welcome, {user.name}!</div>
            <div style={{ color: "#888", fontSize: 13 }}>{user.email}</div>
          </div>
          <button onClick={() => { signOut(auth); setUser(null); navigate("home"); }} style={{ background: "rgba(224,92,92,0.12)", border: "1px solid #e05c5c33", color: "#e05c5c", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>Logout</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ background: "#222", borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
            {TABS.map(([key, icon, label]) => (
              <button key={key} style={tabBtn(tab === key)} onClick={() => setTab(key)}>
                <span style={{ fontSize: 16 }}>{icon}</span> {label}
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div>
            {/* DASHBOARD */}
            {tab === "dashboard" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                  {[["📦", realOrders.length.toString(), "Total Orders"],["❤️", wishlistCount.toString(), "Wishlist"],["💰", `$${totalSaved.toFixed(0)}`, "Total Saved"]].map(([icon,val,label]) => (
                    <div key={label} style={{ ...card(), textAlign: "center", marginBottom: 0 }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#c9a84c", fontWeight: 700 }}>{val}</div>
                      <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={card()}>
                  <div style={sTitle}>Quick Actions</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                    {TABS.filter(t => t[0] !== "dashboard").map(([key, icon, label]) => (
                      <button key={key} onClick={() => setTab(key)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif", transition: "background 0.2s" }}
                        onMouseOver={e => e.currentTarget.style.background = "rgba(201,168,76,0.07)"}
                        onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                        <div style={{ color: "#e0e0e0", fontWeight: 600, fontSize: 13 }}>{label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
              <div style={card()}>
                <div style={sTitle}>My Orders</div>
                {[
                  { id: "ORD-2026-001", date: "Mar 5, 2026", status: "Delivered", total: "$89.50", items: 3, color: "#4ce0a0" },
                  { id: "ORD-2026-002", date: "Feb 28, 2026", status: "In Transit", total: "$145.00", items: 5, color: "#c9a84c" },
                  { id: "ORD-2026-003", date: "Feb 20, 2026", status: "Processing", total: "$34.99", items: 1, color: "#4cc9e0" },
                ].map(o => (
                  <div key={o.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 18, marginBottom: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#f0f0f0", marginBottom: 3 }}>{o.id}</div>
                        <div style={{ color: "#888", fontSize: 13 }}>{o.date} · {o.items} item{o.items > 1 ? "s" : ""}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: "#f0f0f0", fontSize: 15 }}>{o.total}</div>
                        <span style={{ background: `${o.color}22`, color: o.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{o.status}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button style={{ background: "none", border: "1.5px solid rgba(255,255,255,0.12)", color: "#ccc", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>View Details</button>
                      {o.status === "Delivered" && <button onClick={() => navigate("home")} style={{ background: "none", border: "1.5px solid #c9a84c44", color: "#c9a84c", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Buy Again</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WISHLIST */}
            {tab === "wishlist" && (
              <div style={{ ...card(), textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>❤️</div>
                <div style={sTitle}>Your Wishlist</div>
                <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>No saved items yet. Browse products and tap the heart icon to add them here.</p>
                <button onClick={() => navigate("home")} className="app-btn-gold">Browse Products</button>
              </div>
            )}

            {/* ADDRESSES */}
            {tab === "addresses" && (
              <div style={card()}>
                <div style={sTitle}>Saved Addresses</div>
                {savedAddresses.map(addr => (
                  <div key={addr.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 18, marginBottom: 12, border: `1px solid ${addr.isDefault ? "#c9a84c44" : "rgba(255,255,255,0.07)"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#f0f0f0", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                          {addr.label}
                          {addr.isDefault && <span style={{ background: "#c9a84c22", color: "#c9a84c", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>Default</span>}
                        </div>
                        <div style={{ color: "#888", fontSize: 13, lineHeight: 1.6 }}>{addr.address}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {!addr.isDefault && (
                          <button onClick={() => setSavedAddresses(a => a.map(x => ({ ...x, isDefault: x.id === addr.id })))}
                            style={{ background: "none", border: "1.5px solid #c9a84c44", color: "#c9a84c", padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Set Default</button>
                        )}
                        <button onClick={() => setSavedAddresses(a => a.filter(x => x.id !== addr.id))}
                          style={{ background: "none", border: "1.5px solid #e05c5c44", color: "#e05c5c", padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                {!addAddrOpen ? (
                  <button onClick={() => setAddAddrOpen(true)} style={{ width: "100%", background: "rgba(201,168,76,0.06)", border: "1.5px dashed #c9a84c55", color: "#c9a84c", padding: "12px 0", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>+ Add New Address</button>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.08)", marginTop: 8 }}>
                    <div className="form-group"><label className="form-label">Label (e.g. Home, Work)</label><input className="form-input" value={newAddr.label} onChange={e => setNewAddr(f => ({ ...f, label: e.target.value }))} placeholder="Home" /></div>
                    <div className="form-group"><label className="form-label">Full Address</label><textarea className="form-input" value={newAddr.address} onChange={e => setNewAddr(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, City, ZIP" rows={3} style={{ resize: "vertical" }} /></div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={handleAddAddr} className="app-btn-gold">Save Address</button>
                      <button onClick={() => setAddAddrOpen(false)} style={{ background: "none", border: "1.5px solid rgba(255,255,255,0.15)", color: "#aaa", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENT METHODS */}
            {tab === "cards" && (
              <div style={card()}>
                <div style={sTitle}>Payment Methods</div>
                {savedCards.map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 18, marginBottom: 12, border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 32, borderRadius: 6, background: c.brand === "Visa" ? "linear-gradient(135deg,#1a56db,#4c8ae0)" : "linear-gradient(135deg,#eb5757,#c94c4c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{c.brand}</div>
                      <div>
                        <div style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 15 }}>•••• •••• •••• {c.last4}</div>
                        <div style={{ color: "#888", fontSize: 13 }}>{c.name} · Exp {c.expiry}</div>
                      </div>
                    </div>
                    <button onClick={() => setSavedCards(cards => cards.filter(x => x.id !== c.id))}
                      style={{ background: "none", border: "1.5px solid #e05c5c44", color: "#e05c5c", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Remove</button>
                  </div>
                ))}
                {!addCardOpen ? (
                  <button onClick={() => setAddCardOpen(true)} style={{ width: "100%", background: "rgba(201,168,76,0.06)", border: "1.5px dashed #c9a84c55", color: "#c9a84c", padding: "12px 0", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>+ Add New Card</button>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.08)", marginTop: 8 }}>
                    <div className="form-group"><label className="form-label">Card Number (16 digits)</label>
                      <input className="form-input" value={newCard.num} onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim(); setNewCard(c=>({...c,num:v})); }} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="form-group"><label className="form-label">Name on Card</label><input className="form-input" value={newCard.name} onChange={e => setNewCard(c => ({ ...c, name: e.target.value }))} placeholder="John Smith" /></div>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">Expiry (MM/YY)</label>
                        <input className="form-input" value={newCard.expiry} onChange={e => { let v = e.target.value.replace(/\D/g,"").slice(0,4); if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2); setNewCard(c=>({...c,expiry:v})); }} placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="form-group"><label className="form-label">CVV</label><input className="form-input" value={newCard.cvv} onChange={e => setNewCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,"").slice(0,4) }))} placeholder="123" maxLength={4} /></div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={handleAddCard} className="app-btn-gold">Add Card</button>
                      <button onClick={() => setAddCardOpen(false)} style={{ background: "none", border: "1.5px solid rgba(255,255,255,0.15)", color: "#aaa", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === "notifications" && (
              <div style={card()}>
                <div style={sTitle}>Notification Preferences</div>
                {[["deals","🏷️ Deals & Promotions","Exclusive deals and discount coupons"],["orders","📦 Order Updates","Status updates for your orders"],["updates","🆕 Product Updates","New arrivals and restocks"],["newsletter","📧 Weekly Newsletter","Top deals and news digest"]].map(([key,title,desc]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div style={{ color: "#f0f0f0", fontWeight: 500, fontSize: 14 }}>{title}</div>
                      <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{desc}</div>
                    </div>
                    <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                      style={{ width: 50, height: 26, borderRadius: 13, background: notifs[key] ? "#c9a84c" : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 4, left: notifs[key] ? 28 : 4, transition: "left 0.25s" }} />
                    </button>
                  </div>
                ))}
                <button onClick={() => setUser(u => ({ ...u, notifications: notifs }))} className="app-btn-gold" style={{ marginTop: 20 }}>Save Preferences</button>
              </div>
            )}

            {/* SETTINGS */}
            {tab === "settings" && (
              <div>
                {/* Personal Info */}
                <div style={card()}>
                  <div style={sTitle}>Personal Information</div>
                  {saveMsg && <div style={{ background: "#1e3a1e", border: "1px solid #4ce08044", color: "#4ce080", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{saveMsg}</div>}
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" /></div>
                  <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" /></div>
                  <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 5551234567" /></div>
                  <div className="form-group"><label className="form-label">Default Shipping Address</label><textarea className="form-input" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, City, ZIP" rows={3} style={{ resize: "vertical" }} /></div>
                  <button onClick={handleSaveProfile} className="app-btn-gold">Save Changes</button>
                </div>
                {/* Change Password */}
                <div style={card()}>
                  <div style={sTitle}>Change Password</div>
                  {pwMsg && <div style={{ background: pwMsg.includes("✅") ? "#1e3a1e" : "#3a1e1e", border: `1px solid ${pwMsg.includes("✅") ? "#4ce08044" : "#e05c5c44"}`, color: pwMsg.includes("✅") ? "#4ce080" : "#e05c5c", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{pwMsg}</div>}
                  <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" /></div>
                  <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} placeholder="Min 6 characters" /></div>
                  <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Re-enter new password" /></div>
                  <button onClick={handlePwChange} className="app-btn-gold">Update Password</button>
                </div>
                {/* Preferences */}
                <div style={card()}>
                  <div style={sTitle}>Preferences</div>
                  {[["Currency","Display prices in preferred currency",["USD — US Dollar","EUR — Euro","GBP — British Pound"]],["Language","Choose your preferred language",["English","French","Spanish","German"]]].map(([label,desc,opts]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div><div style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 500 }}>{label}</div><div style={{ color: "#888", fontSize: 12 }}>{desc}</div></div>
                      <select style={{ background: "#2a2a2a", border: "1.5px solid rgba(255,255,255,0.12)", color: "#eee", padding: "8px 12px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: "none" }}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                {/* Danger Zone */}
                <div style={{ background: "rgba(224,92,92,0.05)", borderRadius: 16, padding: 24, border: "1px solid #e05c5c22" }}>
                  <div style={{ color: "#e05c5c", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>⚠️ Danger Zone</div>
                  <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Deleting your account is permanent and cannot be undone.</p>
                  <button style={{ background: "rgba(224,92,92,0.15)", border: "1px solid #e05c5c44", color: "#e05c5c", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}
                    onClick={() => { if (window.confirm("Are you sure? This cannot be undone.")) { signOut(auth); setUser(null); navigate("home"); } }}>Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:860px){
          .page-wrap>div:last-child { grid-template-columns: 1fr !important; }
          .page-wrap>div:last-child>div:first-child { display:flex; flex-wrap:wrap; flex-direction:row; gap:6px; }
          .page-wrap>div:last-child>div:first-child button { flex:1 1 auto; min-width:110px; padding:8px 10px !important; font-size:12px !important; }
        }
        @media(max-width:520px){
          .page-wrap>div:last-child>div:last-child>div { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function WishlistPage({ navigate, user }) {
  const { currency } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const loadWishlist = async () => {
      try {
        const { getDoc: gd, doc: dc } = await import("firebase/firestore");
        const snap = await gd(dc(db, "wishlists", user.uid));
        if (snap.exists()) setItems(snap.data().items || []);
      } catch(e) { console.log("Wishlist load:", e); }
      setLoading(false);
    };
    loadWishlist();
  }, [user]);

  const removeItem = async (productId) => {
    const updated = items.filter(i => i.id !== productId);
    setItems(updated);
    if (user) {
      try {
        await setDoc(doc(db, "wishlists", user.uid), { items: updated }, { merge: true });
      } catch(e) {}
    }
  };

  if (!user) return (
    <div style={{ background:"#1a1a1a", minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:56 }}>❤️</div>
      <h2 style={{ color:"#f0f0f0", fontFamily:"'Playfair Display',serif" }}>Sign in to view your Wishlist</h2>
      <button className="app-btn-gold" onClick={() => navigate("signin")}>Sign In</button>
    </div>
  );

  if (loading) return (
    <div style={{ background:"#1a1a1a", minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#888", fontSize:16 }}>Loading wishlist...</div>
    </div>
  );

  return (
    <div style={{ background:"#f0f0f0", minHeight:"80vh", padding:"20px 0 60px", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#0f1111", marginBottom:20 }}>My Wishlist ({items.length})</h1>
        {items.length === 0 ? (
          <div style={{ background:"#fff", borderRadius:8, padding:60, textAlign:"center", border:"1px solid #ddd" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>❤️</div>
            <p style={{ color:"#565959", fontSize:16, marginBottom:20 }}>Your wishlist is empty</p>
            <button className="app-btn-gold" onClick={() => navigate("home")}>Start Shopping</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
            {items.map(product => (
              <div key={product.id} style={{ background:"#fff", borderRadius:8, border:"1px solid #ddd", overflow:"hidden", cursor:"pointer" }}>
                <div style={{ aspectRatio:"1/1", background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:60, position:"relative", overflow:"hidden" }}
                  onClick={() => navigate("product", { product })}>
                  {product.image1
                    ? <img src={product.image1} alt={product.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}} />
                    : product.emoji}
                </div>
                <div style={{ padding:"12px 14px" }}>
                  <div style={{ fontSize:13.5, color:"#0f1111", fontWeight:500, marginBottom:6, lineHeight:1.3 }}>{product.name}</div>
                  <div style={{ fontSize:17, fontWeight:700, color:"#0f1111", marginBottom:10 }}>{fmtPrice(product.price, currency)}</div>
                  <button onClick={() => removeItem(product.id)}
                    style={{ width:"100%", background:"#fff", border:"1px solid #d5d9d9", borderRadius:20, padding:"7px 0", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:"#cc0c39" }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function CartModal({ product, onClose, navigate }) {
  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div className="app-modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
          <h3>Added to Cart!</h3>
        </div>
        <p style={{ textAlign: "center" }}>
          <strong style={{ color: "#f0f0f0" }}>{product.name}</strong> has been added to your cart successfully.
        </p>
        <div className="app-modal-btns" style={{ justifyContent: "center", marginTop: 24 }}>
          <button className="app-btn-gold" onClick={onClose}>OK</button>
          <button className="app-btn-outline" onClick={() => { onClose(); navigate("cart"); }}>View Cart</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════

const FT_CSS = `
  .ft-root { font-family: 'DM Sans', sans-serif; background: #1a1f2e; }
  .ft-backtop { background: #2e3548; text-align: center; padding: 14px; cursor: pointer; color: #ccc; font-size: 13.5px; font-weight: 500; border: none; width: 100%; transition: background 0.2s, color 0.2s; }
  .ft-backtop:hover { background: #3a4060; color: #fff; }
  .ft-newsletter { background: linear-gradient(135deg, #1e2540, #2a1e40); padding: 48px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ft-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .ft-nl-inner { display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap; }
  .ft-nl-text h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: #f0f0f0; margin-bottom: 6px; }
  .ft-nl-text p { font-size: 13.5px; color: #888; }
  .ft-nl-form { display: flex; gap: 10px; flex-wrap: wrap; }
  .ft-nl-input { padding: 11px 18px; border-radius: 8px; border: 1.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: #eee; font-size: 13.5px; font-family: 'DM Sans', sans-serif; outline: none; width: 260px; transition: border-color 0.2s; }
  .ft-nl-input::placeholder { color: #666; }
  .ft-nl-input:focus { border-color: #c9a84c; }
  .ft-nl-btn { padding: 11px 24px; border-radius: 8px; border: none; background: #c9a84c; color: #111; font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .ft-nl-btn:hover { background: #b8963e; }
  .ft-main { padding: 56px 0 40px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ft-main-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 32px; }
  .ft-col-title { font-size: 14.5px; font-weight: 700; color: #f0f0f0; margin-bottom: 18px; }
  .ft-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ft-col ul li button { color: #8a8f9e; font-size: 13px; transition: color 0.2s; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; text-align: left; }
  .ft-col ul li button:hover { color: #c9a84c; }
  .ft-features { padding: 36px 0; border-bottom: 1px solid rgba(255,255,255,0.06); background: #1e2338; }
  .ft-features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .ft-feature { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
  .ft-feature-icon { font-size: 26px; flex-shrink: 0; }
  .ft-feature-title { font-size: 13.5px; font-weight: 600; color: #e0e0e0; }
  .ft-feature-sub { font-size: 11.5px; color: #666; margin-top: 2px; }
  .ft-middle { padding: 36px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ft-middle-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
  .ft-selects { display: flex; gap: 10px; flex-wrap: wrap; }
  .ft-select-box { display: flex; align-items: center; gap: 8px; border: 1.5px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 14px; background: transparent; color: #ccc; font-size: 13px; font-family: 'DM Sans', sans-serif; }
  .ft-select-box select { background: transparent; border: none; color: #ccc; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; }
  .ft-select-box select option { background: #222; color: #eee; }
  .ft-social { display: flex; gap: 10px; }
  .ft-social-btn { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; text-decoration: none; transition: background 0.2s; }
  .ft-social-btn:hover { background: rgba(201,168,76,0.2); }
  .ft-bottom { padding: 20px 0; background: #141820; }
  .ft-bottom-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
  .ft-copyright { font-size: 12.5px; color: #555; }
  .ft-copyright span { color: #c9a84c; }
  .ft-bottom-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .ft-bottom-links button { font-size: 12.5px; color: #555; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .ft-bottom-links button:hover { color: #aaa; }
  .ft-payments { padding: 24px 0; background: #161b28; border-top: 1px solid rgba(255,255,255,0.04); text-align: center; }
  .ft-pay-title { font-size: 12px; color: #555; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase; }
  .ft-pay-icons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .ft-pay-icon { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 14px; font-size: 12px; color: #aaa; font-weight: 600; }
  .ft-brands { padding: 18px 0; background: #141820; border-top: 1px solid rgba(255,255,255,0.04); }
  .ft-brands-inner { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 24px; }
  .ft-brands-inner a { font-size: 12px; color: #444; text-decoration: none; transition: color 0.2s; }
  .ft-brands-inner a:hover { color: #888; }
  @media (max-width: 1024px) { .ft-main-grid { grid-template-columns: repeat(3,1fr); } .ft-features-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 680px) { .ft-main-grid { grid-template-columns: repeat(2,1fr); gap: 24px; } .ft-middle-inner { flex-direction: column; align-items: flex-start; } .ft-nl-inner { flex-direction: column; } .ft-nl-input { width: 100%; } .ft-bottom-inner { flex-direction: column; align-items: center; text-align: center; } }
`;

const FOOTER_COLS = [
  { title: "Get to Know Us", links: [["Careers","careers"],["Blog","blog"],["About Us","about"],["Investor Relations","investor"],["Privacy Policy","privacy"],["Contact Us","contact"]] },
  { title: "Make Money with Us", links: [["Sell on Pantheon","sell"],["Become an Affiliate","affiliate"],["Advertise Products","advertise"],["Self-Publish with Us","selfpublish"],["Host a Pantheon Hub","hosthub"]] },
  { title: "Payment Products", links: [["Pantheon Business Card","bizcard"],["Shop with Points","shoppoints"],["Reload Your Balance","reload"],["Currency Converter","currconv"],["Gift Cards","giftcards"],["Buy Now Pay Later","bnpl"]] },
  { title: "Let Us Help You", links: [["Your Account","account"],["Your Orders","account"],["Shipping & Policies","shipping"],["Returns & Replacements","returns"],["Help Center","helpcenter"],["Track Your Order","trackorder"]] },
  { title: "Browse Categories", links: [["Trending Products","trending"],["On Sale","onsale"],["Electronics","electronics"],["Gaming","gaming"],["Clothing","clothing"],["Sports & Outdoors","sports"]] },
];

function Footer({ navigate, currency, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes("@")) { setSubscribed(true); setTimeout(() => setSubscribed(false), 3000); setEmail(""); }
  };

  const handleLink = (target) => {
    const pages = ["careers","blog","about","investor","privacy","contact","account","cart","sell","affiliate","advertise","selfpublish","hosthub","bizcard","shoppoints","reload","currconv","giftcards","bnpl","shipping","returns","helpcenter","trackorder"];
    const catIds = ALL_CATEGORIES.map(c => c.id);
    if (pages.includes(target)) navigate(target);
    else if (catIds.includes(target)) navigate("category", { categoryId: target });
  };

  return (
    <>
      <style>{FT_CSS}</style>
      <footer className="ft-root">
        <button className="ft-backtop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{t.backToTop || "↑  Back to top"}</button>
        <div className="ft-newsletter">
          <div className="ft-wrap">
            <div className="ft-nl-inner">
              <div className="ft-nl-text"><h3>{t.newsletterTitle || "Stay in the loop"} 📬</h3><p>{t.newsletterSub || "Get the latest deals, new arrivals & exclusive offers."}</p></div>
              <div className="ft-nl-form">
                <input type="email" className="ft-nl-input" placeholder={t.emailPlaceholder || "Enter your email address"} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubscribe()} />
                <button className="ft-nl-btn" onClick={handleSubscribe}>{subscribed ? "✓ Subscribed!" : (t.subscribe || "Subscribe")}</button>
              </div>
            </div>
          </div>
        </div>
        <div className="ft-features">
          <div className="ft-wrap">
            <div className="ft-features-grid">
              {[{icon:"🚚",title:"Free Delivery",sub:"On orders over $50"},{icon:"🔄",title:"Easy Returns",sub:"30 day return policy"},{icon:"🔒",title:"Secure Payment",sub:"100% secure transactions"},{icon:"🎧",title:"24/7 Support",sub:"Dedicated support team"}].map(f => (
                <div className="ft-feature" key={f.title}><div className="ft-feature-icon">{f.icon}</div><div><div className="ft-feature-title">{f.title}</div><div className="ft-feature-sub">{f.sub}</div></div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="ft-main">
          <div className="ft-wrap">
            <div className="ft-main-grid">
              {FOOTER_COLS.map(col => (
                <div className="ft-col" key={col.title}>
                  <div className="ft-col-title">{col.title}</div>
                  <ul>{col.links.map(([label, target]) => (
                    <li key={label}><button onClick={() => handleLink(target)}>{label}</button></li>
                  ))}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ft-middle">
          <div className="ft-wrap">
            <div className="ft-middle-inner">
              <div onClick={() => navigate("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:32, height:32, borderRadius:7, background:"linear-gradient(135deg,#c9a84c,#e8c96a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#111", fontWeight:900 }}>⚡</div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#f0f0f0" }}>Pan<em style={{ color:"#c9a84c", fontStyle:"italic" }}>theon</em></span>
              </div>
              <div className="ft-selects">
                <div className="ft-select-box">🌐<select value={language} onChange={() => {}}>{Object.keys(TRANSLATIONS).map(l => <option key={l}>{l}</option>)}</select></div>
                <div className="ft-select-box">💱<select value={currency} onChange={() => {}}>{Object.keys(CURRENCIES).map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="ft-social">
                {[["🐦","Twitter"],["📘","Facebook"],["📸","Instagram"],["▶️","YouTube"],["💼","LinkedIn"]].map(([icon, name]) => (
                  <button key={name} className="ft-social-btn" title={name}>{icon}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="ft-payments">
          <div className="ft-wrap">
            <div className="ft-pay-title">Secure Payment Methods</div>
            <div className="ft-pay-icons">{["VISA","Mastercard","PayPal","Stripe","Apple Pay","Google Pay","Amazon Pay","Klarna"].map(p => <div className="ft-pay-icon" key={p}>{p}</div>)}</div>
          </div>
        </div>
        <div className="ft-brands">
          <div className="ft-wrap">
            <div className="ft-brands-inner">
              {["Pantheon Music","Pantheon Ads","Pantheon Business","Pantheon Fresh","Pantheon Prime","Pantheon Pay","Pantheon Books","Pantheon Games"].map(b => <span key={b} style={{cursor:"default"}}>{b}</span>)}
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <div className="ft-wrap">
            <div className="ft-bottom-inner">
              <div className="ft-copyright">© 2026 <span>Pantheon</span>. {t.allRights || "All rights reserved."} Made with ❤️</div>
              <div className="ft-bottom-links">
                <button onClick={() => navigate("privacy")}>Privacy Policy</button>
                <button onClick={() => navigate("contact")}>Contact Us</button>
                <button onClick={() => navigate("about")}>About Us</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FOOTER INFO PAGES
// ═══════════════════════════════════════════════════════════════════

function InfoPageLayout({ title, icon, children, navigate }) {
  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap" style={{ maxWidth: 860 }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "#aaa", padding: "7px 16px", borderRadius: 8, cursor: "pointer", marginBottom: 28, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>← Back to Home</button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <span style={{ fontSize: 40 }}>{icon}</span>
          <h1 className="page-title" style={{ margin: 0 }}>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoSection({ title, text }) {
  return (
    <div style={{ background: "#222", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 14 }}>
      <h3 style={{ color: "#f0f0f0", fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "#999", fontSize: 14, lineHeight: 1.8 }}>{text}</p>
    </div>
  );
}

function SellPage({ navigate }) {
  return <InfoPageLayout title="Sell on Pantheon" icon="🏪" navigate={navigate}>
    <InfoSection title="How It Works" text="Selling on Pantheon is simple. Register as a seller, list your products with photos and descriptions, set your prices, and start receiving orders. Our platform handles payment processing — payouts go directly to your bank account every 7 days." />
    <InfoSection title="Seller Fees" text="We charge a straightforward commission of 8–12% per sale depending on category. No monthly fees, no listing fees. You only pay when you make a sale, making Pantheon the most cost-effective marketplace for both small and large sellers." />
    <InfoSection title="Seller Protection" text="Every transaction is covered by Dyard Seller Protection. If a buyer files a fraudulent dispute, our team investigates and protects your revenue. Our advanced fraud detection catches 94% of fraudulent claims before they ever reach you." />
    <InfoSection title="Getting Started" text="Register at seller.pantheonstore.com, submit your business documentation, and you can be live within 24 hours. Our dedicated seller support team is available 7 days a week to help you grow your store." />
  </InfoPageLayout>;
}

function AffiliatePage({ navigate }) {
  return <InfoPageLayout title="Become an Affiliate" icon="🤝" navigate={navigate}>
    <InfoSection title="Earn with Every Referral" text="Join the Pantheon Affiliate Program and earn up to 10% commission on every sale you refer. Share your unique link on social media, blogs, or websites and start earning from day one — no selling required." />
    <InfoSection title="Commission Structure" text="Standard categories: 5%. Electronics & Tech: 4%. Fashion & Jewelry: 8%. Home & Garden: 6%. Gaming: 7%. Payments are made monthly via bank transfer or PayPal with a minimum payout threshold of $50." />
    <InfoSection title="Tracking & Analytics" text="Our affiliate dashboard gives you real-time visibility into clicks, conversions, and earnings. Advanced link tracking ensures you get credit for every referral — even when customers return days after clicking your link." />
    <InfoSection title="How to Apply" text="Sign up at affiliates.pantheonstore.com, get approved within 48 hours, and receive your unique tracking links and marketing materials immediately. Start promoting and earning right away." />
  </InfoPageLayout>;
}

function AdvertisePage({ navigate }) {
  return <InfoPageLayout title="Advertise Your Products" icon="📢" navigate={navigate}>
    <InfoSection title="Sponsored Products" text="Put your products in front of millions of shoppers actively looking to buy. Pantheon's Sponsored Products appear at the top of search results and category pages, maximizing visibility where it matters most." />
    <InfoSection title="Display Advertising" text="Our banner and display ad placements are available across the homepage, category pages, and checkout flow. Target by category, demographics, purchase history, and browsing behavior for maximum relevance." />
    <InfoSection title="Ad Formats Available" text="We offer Sponsored Products, Sponsored Brands, Display Ads, Video Ads, and Email Newsletter Placements. All ads are priced on a cost-per-click (CPC) basis — you only pay when someone clicks your ad." />
    <InfoSection title="Get Started Today" text="Contact our advertising team at ads@pantheonstore.com or visit our Advertising Center to set up your first campaign. Minimum daily budget starts at just $5 — accessible for businesses of all sizes." />
  </InfoPageLayout>;
}

function SelfPublishPage({ navigate }) {
  return <InfoPageLayout title="Self-Publish with Dyard" icon="✍️" navigate={navigate}>
    <InfoSection title="Publish Your Book" text="Pantheon Books lets independent authors publish and sell eBooks and print-on-demand paperbacks with zero upfront cost. Keep up to 70% royalties on every sale — far more than traditional publishing ever offered." />
    <InfoSection title="eBooks & Print-on-Demand" text="Upload your manuscript in PDF, EPUB, or DOCX format. We handle formatting, listing, and digital delivery. For print copies, our print-on-demand service produces and ships books only when ordered — no inventory required." />
    <InfoSection title="Marketing Tools" text="Access promotional tools including subscription program inclusion, countdown deals, and free book promotions to boost visibility and reviews. Our algorithm surfaces your book to readers most likely to enjoy it." />
    <InfoSection title="Royalties & Payments" text="Earn 35–70% royalties depending on your pricing tier and distribution settings. Payments are sent monthly with no minimum threshold. Track your sales and earnings in real-time through your author dashboard." />
  </InfoPageLayout>;
}

function HostHubPage({ navigate }) {
  return <InfoPageLayout title="Host a Pantheon Hub" icon="🏬" navigate={navigate}>
    <InfoSection title="What is a Pantheon Hub?" text="A Pantheon Hub is a physical pickup and drop-off point for Dyard orders. Hub hosts earn income for every package they handle — perfect for small shop owners, pharmacies, convenience stores, or anyone with secure storage space." />
    <InfoSection title="Earning Potential" text="Hub hosts earn $0.50–$2.00 per package depending on size and service type. High-traffic hubs handling 50+ packages per day can earn over $1,000 per month as a consistent passive income stream alongside your existing business." />
    <InfoSection title="Requirements" text="You need a secure storage space of at least 50 sq ft, business hours of at least 5 days per week, a smartphone for scanning packages, and a reliable internet connection. No prior experience required." />
    <InfoSection title="Apply Now" text="Apply at hub.pantheonstore.com. Our team will verify your location and onboard you within 5 business days. All necessary equipment — scanner, labels, and packaging supplies — is provided free of charge." />
  </InfoPageLayout>;
}

function BizCardPage({ navigate }) {
  return <InfoPageLayout title="Pantheon Business Card" icon="💳" navigate={navigate}>
    <InfoSection title="Overview" text="The Pantheon Business Card gives business owners exclusive access to trade pricing, extended payment terms, and a dedicated account manager. Apply for a credit limit of up to $50,000 with flexible repayment options." />
    <InfoSection title="Card Benefits" text="0% interest for the first 6 months. 2% cashback on all Dyard purchases. Separate business billing with detailed expense reports. Multi-user access for your entire team with individual spend limits." />
    <InfoSection title="Eligibility" text="Open to registered businesses with at least 6 months of trading history. Both personal and business credit scores are considered during the application process. Sole traders and LLCs are welcome to apply." />
    <InfoSection title="How to Apply" text="Submit your application online at business.pantheonstore.com. Approval decisions are typically made within 2 business days. Approved applicants receive their physical card within 5–7 business days." />
  </InfoPageLayout>;
}

function ShopPointsPage({ navigate }) {
  return <InfoPageLayout title="Shop with Points" icon="⭐" navigate={navigate}>
    <InfoSection title="Earn Points Automatically" text="Earn 1 Dyard Point for every $1 spent on eligible purchases. Bonus points are available during promotional events, flash sales, and special occasions. Points never expire as long as your account is active." />
    <InfoSection title="Redeem at Checkout" text="100 Points = $1 discount. Points can be applied at checkout for any eligible purchase. A maximum of 50% of any single order can be paid with points to ensure fair usage across all customers." />
    <InfoSection title="Bonus Point Opportunities" text="Double points on your birthday month. Triple points during major sales events. 500 bonus points for writing a verified product review. 250 bonus points for referring a friend who completes their first purchase." />
    <InfoSection title="Terms & Conditions" text="Points have no cash value and cannot be transferred between accounts. Returned items will result in an equivalent points deduction. Full terms are available in your account under the Points & Rewards section." />
  </InfoPageLayout>;
}

function ReloadPage({ navigate }) {
  return <InfoPageLayout title="Reload Your Balance" icon="💰" navigate={navigate}>
    <InfoSection title="What is Pantheon Balance?" text="Your Pantheon Balance is a secure prepaid wallet tied to your account. Load funds using any payment method and use your balance for faster, one-click checkout on any Pantheon purchase." />
    <InfoSection title="Reload Methods" text="Credit/Debit Cards (instant), Bank Transfer (1–3 business days), PayPal (instant), Gift Cards (instant). Minimum reload: $5. Maximum account balance: $5,000." />
    <InfoSection title="Why Use Pantheon Balance?" text="One-click checkout with no re-entering card details. No transaction fees on balance-funded purchases. Earn 1% extra cashback on all orders paid using your balance. Funds are insured against unauthorized access up to $5,000." />
    <InfoSection title="Security Guarantee" text="Your balance is protected by Pantheon's comprehensive fraud guarantee. Any unauthorized transactions are fully investigated and refunded within 24 hours of a verified report to our security team." />
  </InfoPageLayout>;
}

function CurrConvPage({ navigate }) {
  return <InfoPageLayout title="Currency Converter" icon="💱" navigate={navigate}>
    <InfoSection title="Multi-Currency Shopping" text="Pantheon supports 40+ global currencies. Browse and compare prices in your local currency with confidence. Exchange rates are updated every 15 minutes using live market data from trusted financial institutions." />
    <InfoSection title="Supported Currencies" text="USD, EUR, GBP, CAD, AUD, JPY, CNY, INR, CHF, and 30+ more. Select your preferred currency from the top navigation bar or save your preference permanently in your account settings." />
    <InfoSection title="How Conversion Works" text="Prices displayed in your chosen currency are converted at the current mid-market rate plus a small 1.5% conversion fee. The exact final amount in your billing currency is always clearly shown before you confirm any purchase." />
    <InfoSection title="Seller Payout Currencies" text="Sellers can receive payouts in USD, EUR, GBP, CAD, or AUD. Additional payout currencies may be available depending on your region and banking institution. Contact seller support for currency-specific inquiries." />
  </InfoPageLayout>;
}

function GiftCardsPage({ navigate }) {
  return <InfoPageLayout title="Gift Cards" icon="🎁" navigate={navigate}>
    <InfoSection title="Give the Perfect Gift" text="Pantheon Gift Cards are available in denominations of $10, $25, $50, $100, and $200. They never expire and can be used on any purchase across all categories on Pantheon — giving the recipient complete freedom." />
    <InfoSection title="Digital Delivery" text="Purchase a digital gift card and it is emailed instantly to the recipient. Include a personal message and choose a design from our library of 20+ themed card designs for every occasion." />
    <InfoSection title="Redeeming a Gift Card" text="Enter the 16-character gift card code at checkout or in your account under 'Gift Cards & Promo Codes'. The balance is applied instantly and any unused balance remains available for future purchases with no time limit." />
    <InfoSection title="Corporate Gifting" text="Purchasing gift cards in bulk for employee rewards or corporate gifting programs? Contact corporate@pantheonstore.com for volume discounts on orders of 50 or more cards. Custom branding options are also available." />
  </InfoPageLayout>;
}

function BNPLPage({ navigate }) {
  return <InfoPageLayout title="Buy Now Pay Later" icon="🗓️" navigate={navigate}>
    <InfoSection title="Split Any Purchase Into 4" text="Pay for any order of $20 or more in 4 equal installments over 6 weeks. Pay just 25% at checkout and the rest is automatically charged every 2 weeks — completely interest free with no hidden fees." />
    <InfoSection title="Eligibility" text="Available to customers aged 18 and over with a valid payment method saved on file. We perform a soft credit check only — this has no impact on your credit score. Approval is instant and happens directly at checkout." />
    <InfoSection title="How It Works" text="Simply select 'Buy Now Pay Later' at checkout, review your automatic payment schedule, and confirm your order. Subsequent payments are automatically charged to your saved card every 2 weeks — nothing to remember." />
    <InfoSection title="Late Payment Policy" text="If a scheduled payment fails, you have a 7-day grace period to update your payment method and retry. After 7 days without resolution, a late fee of $7 is applied. Repeated late payments may affect future BNPL eligibility." />
  </InfoPageLayout>;
}

function ShippingPage({ navigate }) {
  return <InfoPageLayout title="Shipping & Policies" icon="🚚" navigate={navigate}>
    <InfoSection title="Delivery Options" text="Standard Delivery (5–7 business days): Free on orders over $50, $5.99 otherwise. Express Delivery (2–3 business days): $9.99. Overnight Delivery (next business day, order by 2PM): $19.99. International shipping rates are calculated at checkout." />
    <InfoSection title="Order Processing" text="Orders placed before 2:00 PM EST on business days are processed the same day. Orders placed after 2 PM or on weekends and holidays are processed on the next available business day." />
    <InfoSection title="Order Tracking" text="Once your order ships, you will receive a tracking number via email and in your account. Track your order in real-time from My Account → Orders. Live tracking is available for all domestic and most international shipments." />
    <InfoSection title="International Shipping" text="We ship to over 50 countries worldwide. International orders may be subject to customs duties and import taxes, which are the buyer's sole responsibility. Estimated delivery for international orders is 7–21 business days depending on destination." />
  </InfoPageLayout>;
}

function ReturnsPage({ navigate }) {
  return <InfoPageLayout title="Returns & Replacements" icon="🔄" navigate={navigate}>
    <InfoSection title="Return Window" text="Most items can be returned within 30 days of delivery for a full refund. For damaged or incorrect items, you must contact us within 3 days of delivery. Electronics must be returned within 15 days. Final sale items are non-returnable." />
    <InfoSection title="How to Return an Item" text="Log into your account, go to Orders, select the item you want to return, choose your return reason, and print your prepaid return shipping label. Drop off the package at any authorized carrier location near you." />
    <InfoSection title="Refund Timeline" text="Refunds are processed within 3–5 business days of us receiving the returned item in acceptable condition. The refund will appear on your original payment method within 5–10 business days depending on your bank or card issuer." />
    <InfoSection title="Replacements for Damaged Items" text="If your item arrived damaged, defective, or incorrect, you can request a replacement instead of a refund. Replacement orders are shipped with express priority at absolutely no extra cost to you." />
    <InfoSection title="Non-Returnable Items" text="Perishable goods, digital downloads, gift cards, opened personal care items, and items explicitly marked as final sale cannot be returned. Custom-made or personalized items are also non-returnable under any circumstances." />
  </InfoPageLayout>;
}

function HelpCenterPage({ navigate }) {
  const faqs = [
    ["How do I track my order?", "Go to My Account → Orders and click 'View Details' on any order. Once shipped, a live tracking link will appear. You also receive a tracking number by email when your order ships."],
    ["What payment methods are accepted?", "We accept Visa, Mastercard, PayPal, Stripe, Apple Pay, Google Pay, and Pantheon Balance. You can save multiple payment methods in your account for faster checkout."],
    ["How do I return an item?", "Go to My Account → Orders, find your order, and click 'Return Item'. Print the free prepaid return label and drop it off at a carrier location within 30 days of delivery."],
    ["Can I change or cancel my order?", "Orders can be modified or cancelled within 1 hour of placement. After that, you'll need to wait for delivery and then initiate a return through your account."],
    ["How long does delivery take?", "Standard: 5–7 business days (free over $50). Express: 2–3 days ($9.99). Overnight: next business day ($19.99). International: 7–21 days."],
    ["How do I apply a promo code?", "Enter your promo code in the 'Promo / Gift Code' field at checkout before confirming payment. The discount is applied automatically and shown in your order summary."],
    ["What if my item arrives damaged?", "Contact us within 3 days of delivery with a photo of the damage. We'll send a free replacement or issue a full refund — whichever you prefer."],
    ["How do I contact customer support?", "You can reach us via the Contact Us page, by email at support@pantheonstore.com, or by phone at +1 (212) 555-0187, Monday–Friday 9AM–6PM EST."],
  ];
  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap" style={{ maxWidth: 800 }}>
        <h1 className="page-title">Help Center</h1>
        <p className="page-subtitle">Quick answers to the most common questions</p>
        {faqs.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
        <div style={{ background: "linear-gradient(135deg,#c9a84c14,transparent)", borderRadius: 16, padding: 28, border: "1px solid #c9a84c22", marginTop: 32, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎧</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0f0f0", marginBottom: 8 }}>Still need help?</h3>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Our support team is available 24/7. Average response time under 2 hours.</p>
          <button onClick={() => navigate("contact")} className="app-btn-gold">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#222", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", color: "#f0f0f0", padding: "18px 20px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {q} <span style={{ color: "#c9a84c", fontSize: 20, flexShrink: 0, marginLeft: 12 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ padding: "0 20px 18px", color: "#999", fontSize: 14, lineHeight: 1.8 }}>{a}</div>}
    </div>
  );
}

function TrackOrderPage({ navigate }) {
  const [trackNum, setTrackNum] = useState("");
  const [result, setResult] = useState(null);
  const handleTrack = () => {
    if (!trackNum.trim()) { alert("Please enter a tracking number."); return; }
    setResult({
      id: trackNum.toUpperCase(), status: "In Transit", eta: "Mar 12, 2026",
      steps: [
        { label: "Order Placed", done: true, date: "Mar 8" },
        { label: "Processing", done: true, date: "Mar 9" },
        { label: "Shipped", done: true, date: "Mar 10" },
        { label: "In Transit", done: true, date: "Mar 11" },
        { label: "Out for Delivery", done: false, date: "Mar 12" },
        { label: "Delivered", done: false, date: "Estimated" },
      ]
    });
  };
  return (
    <div style={{ background: "#1a1a1a", minHeight: "80vh", padding: "60px 0", fontFamily: "'DM Sans',sans-serif" }}>
      <div className="page-wrap" style={{ maxWidth: 700 }}>
        <h1 className="page-title">Track Your Order</h1>
        <p className="page-subtitle">Enter your order ID or tracking number below</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <input className="form-input" value={trackNum} onChange={e => setTrackNum(e.target.value)} placeholder="e.g. ORD-2026-001 or TRK123456" onKeyDown={e => e.key === "Enter" && handleTrack()} style={{ flex: 1, minWidth: 200 }} />
          <button onClick={handleTrack} className="app-btn-gold" style={{ padding: "11px 28px" }}>Track</button>
        </div>
        {result && (
          <div style={{ background: "#222", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div><div style={{ color: "#888", fontSize: 13 }}>Tracking Number</div><div style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 16 }}>{result.id}</div></div>
              <div><div style={{ color: "#888", fontSize: 13 }}>Status</div><span style={{ background: "#c9a84c22", color: "#c9a84c", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{result.status}</span></div>
              <div><div style={{ color: "#888", fontSize: 13 }}>Estimated Delivery</div><div style={{ color: "#4ce0a0", fontWeight: 600 }}>{result.eta}</div></div>
            </div>
            <div style={{ position: "relative" }}>
              {result.steps.map((step, i) => (
                <div key={step.label} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: i < result.steps.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? "#c9a84c" : "rgba(255,255,255,0.1)", border: step.done ? "none" : "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: step.done ? "#111" : "#555", flexShrink: 0, fontWeight: 700 }}>{step.done ? "✓" : ""}</div>
                    {i < result.steps.length - 1 && <div style={{ width: 2, height: 28, background: step.done ? "#c9a84c44" : "rgba(255,255,255,0.06)", margin: "4px 0" }} />}
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ color: step.done ? "#f0f0f0" : "#666", fontWeight: step.done ? 600 : 400, fontSize: 14 }}>{step.label}</div>
                    <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!result && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ color: "#888", fontSize: 14 }}>Enter your tracking number above to see real-time delivery status.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("home");
  const [pageParams, setPageParams] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [cartModal, setCartModal] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("English");
  const [postLoginPage, setPostLoginPage] = useState(null);
  const [postLoginParams, setPostLoginParams] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  // authLoading removed

  // Firebase auth state listener — keeps user logged in on refresh
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const name = userDoc.exists() ? userDoc.data().name : firebaseUser.email.split("@")[0];
          setUser({ uid: firebaseUser.uid, name, email: firebaseUser.email });
        } catch {
          setUser({ uid: firebaseUser.uid, name: firebaseUser.email.split("@")[0], email: firebaseUser.email });
        }
      } else {
        setUser(null);
      }
      // auth ready
    });
    return () => unsub();
  }, []);

  const navigate = useCallback((newPage, params = {}) => {
    setPage(newPage);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Guarded add to cart — shows auth modal handled inside ProductSection/DetailPage
  const onAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + (product.qty || 1) } : i);
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
    setCartModal(product);
  };

  const onViewProduct = (product) => {
    setCurrentProduct(product);
    navigate("product");
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 20);
    });
  };

  // Override setUser to handle post-login redirect
  const handleSetUser = (u) => {
    setUser(u);
    if (u) {
      if (postLoginPage) {
        const dest = postLoginPage;
        const params = postLoginParams;
        setPostLoginPage(null);
        setPostLoginParams({});
        setTimeout(() => navigate(dest, params), 50);
      } else {
        setTimeout(() => navigate("home"), 50);
      }
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <>
            <HeroCarousel navigate={navigate} t={t} />
            <ProductSection navigate={navigate} onViewProduct={onViewProduct} user={user} />
          </>
        );
      case "category":
        return <CategoryPage categoryId={pageParams.categoryId || "trending"} onAddToCart={onAddToCart} onViewProduct={onViewProduct} currency={currency} language={language} user={user} navigate={navigate} />;
      case "product":
        return currentProduct
          ? <ProductDetailPage product={currentProduct} onAddToCart={onAddToCart} navigate={navigate} user={user} onViewProduct={onViewProduct} recentlyViewed={recentlyViewed} />
          : null;
      case "cart":
        return <CartPage cartItems={cartItems} setCartItems={setCartItems} navigate={navigate} currency={currency} language={language} />;
      case "checkout":
        if (!user) {
          // Redirect to sign in, come back to checkout
          setPostLoginPage("checkout");
          setTimeout(() => navigate("signin"), 0);
          return null;
        }
        return <CheckoutPage cartItems={cartItems} setCartItems={setCartItems} navigate={navigate} currency={currency} language={language} />;
      case "signin":     return <SignInPage navigate={navigate} setUser={handleSetUser} language={language} />;
      case "signup":     return <SignUpPage navigate={navigate} setUser={handleSetUser} language={language} />;
      case "account":    return <AccountPage user={user} setUser={setUser} navigate={navigate} language={language} />;
      case "wishlist":   return <WishlistPage navigate={navigate} user={user} language={language} />;
      case "about":      return <AboutPage />;
      case "contact":    return <ContactPage />;
      case "privacy":    return <PrivacyPage />;
      case "blog":       return <BlogPage navigate={navigate} />;
      case "careers":    return <CareersPage />;
      case "investor":   return <InvestorPage />;
      case "sell":       return <SellPage navigate={navigate} />;
      case "affiliate":  return <AffiliatePage navigate={navigate} />;
      case "advertise":  return <AdvertisePage navigate={navigate} />;
      case "selfpublish":return <SelfPublishPage navigate={navigate} />;
      case "hosthub":    return <HostHubPage navigate={navigate} />;
      case "bizcard":    return <BizCardPage navigate={navigate} />;
      case "shoppoints": return <ShopPointsPage navigate={navigate} />;
      case "reload":     return <ReloadPage navigate={navigate} />;
      case "currconv":   return <CurrConvPage navigate={navigate} />;
      case "giftcards":  return <GiftCardsPage navigate={navigate} />;
      case "bnpl":       return <BNPLPage navigate={navigate} />;
      case "shipping":   return <ShippingPage navigate={navigate} />;
      case "returns":    return <ReturnsPage navigate={navigate} />;
      case "helpcenter": return <HelpCenterPage navigate={navigate} />;
      case "trackorder": return <TrackOrderPage navigate={navigate} />;
      case "orders":     return <AccountPage user={user} setUser={setUser} navigate={navigate} language={language} />;
      default:
        return (
          <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h2 style={{ color: "#f0f0f0", marginBottom: 12 }}>Page Not Found</h2>
            <button className="app-btn-gold" onClick={() => navigate("home")}>Back to Home</button>
          </div>
        );
    }
  };

  return (
    <AppContext.Provider value={{ currency, language, t, fmtPrice: (p) => fmtPrice(p, currency) }}>
      <style>{GLOBAL_CSS}{PS_CSS}{CAT_CSS}</style>
      <Header
        navigate={navigate} cartItems={cartItems} setCartItems={setCartItems}
        user={user} setUser={setUser}
        currency={currency} setCurrency={setCurrency}
        language={language} setLanguage={setLanguage}
      />
      <main style={{ minHeight: "60vh" }}>
        {renderPage()}
      </main>
      <Footer navigate={navigate} currency={currency} language={language} />
      {cartModal && <CartModal product={cartModal} onClose={() => setCartModal(null)} navigate={navigate} />}
    </AppContext.Provider>
  );
}