
/*
Tipue Search 6.1
Copyright (c) 2017 Tipue
Tipue Search is released under the MIT License
http://www.tipue.com/search
*/


/*
Stop words
Stop words list from http://www.ranks.nl/stopwords
*/

var tipuesearch_pages = [
  "http://207.154.195.5:3000/dobro_je_vedeti/sterilizacija_kastracija",
  "http://207.154.195.5:3000/pomoc/donacije",
  "http://207.154.195.5:3000/o_nas/kdo_smo",
  "http://207.154.195.5:3000/o_nas/zavetisce_mh",
  "http://207.154.195.5:3000/o_nas/veterina_mh",
  "http://207.154.195.5:3000/o_nas/macji_boter",
  "http://207.154.195.5:3000/o_nas/super_combe",
  "http://207.154.195.5:3000/o_nas/kontakt",
  "http://207.154.195.5:3000/o_nas/v_medijih",
  "http://207.154.195.5:3000/posvojitev/pogoji_in_postopek",
  "http://207.154.195.5:3000/dobro_je_vedeti/koristne_informacije",
  "http://207.154.195.5:3000/dobro_je_vedeti/izobrazevalne_vsebine",
  "http://207.154.195.5:3000/pomoc/nacini_pomoci",
  "http://207.154.195.5:3000/pomoc/dohodnina",
  "http://207.154.195.5:3000/projekt_vita/predstavitev",
  "http://207.154.195.5:3000/projekt_vita/po_zivljenju_za_zivljenje",
  "http://207.154.195.5:3000/projekt_vita/kako_zapustiti_premozenje_macji_hisi",
  "http://207.154.195.5:3000/projekt_vita/skrb_za_muce_po_smrti",
  "http://207.154.195.5:3000/projekt_vita/najpogostejsa_vprasanja"
];


var tipuesearch_stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];


// Word replace

var tipuesearch_replace = {'words': [
     {'word': 'mačke', 'replace_with': 'muce'}
]};


// Weighting

var tipuesearch_weight = {'weight': [
     {'url': 'http://www.tipue.com', 'score': 20},
     {'url': 'http://www.tipue.com/search', 'score': 30},
     {'url': 'http://www.tipue.com/is', 'score': 10}
]};


// Illogical stemming

var tipuesearch_stem = {'words': [
     {'word': 'e-mail', 'stem': 'email'},
     {'word': 'javascript', 'stem': 'jquery'},
     {'word': 'javascript', 'stem': 'js'}
]};


// Related searches

var tipuesearch_related = {'searches': [
     {'search': 'tipue', 'related': 'Tipue Search'},
     {'search': 'tipue', 'before': 'Tipue Search', 'related': 'Getting Started'},
     {'search': 'tipue', 'before': 'Tipue', 'related': 'jQuery'},
     {'search': 'tipue', 'before': 'Tipue', 'related': 'Blog'}
]};


// Internal strings

var tipuesearch_string_1 = 'Brez naslova';
var tipuesearch_string_2 = 'Rezultati za';
var tipuesearch_string_3 = 'Search instead for';
var tipuesearch_string_4 = '1 rezultat';
var tipuesearch_string_5 = 'rezultatov';
var tipuesearch_string_6 = 'Nazaj';
var tipuesearch_string_7 = 'Več';
var tipuesearch_string_8 = 'Ni rezultatov.';
var tipuesearch_string_9 = 'Common words are largely ignored.';
var tipuesearch_string_10 = 'Premalo črk.';
var tipuesearch_string_11 = 'Vnesti je treba en znak ali več.';
var tipuesearch_string_12 = 'Vnesti je treba';
var tipuesearch_string_13 = 'znake ali več.';
var tipuesearch_string_14 = 's';
var tipuesearch_string_15 = 'V povezavi z';


// Internals


// Timer for showTime

var startTimer = new Date().getTime();
