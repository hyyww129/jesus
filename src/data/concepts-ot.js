/* ==========================================================================
   CONCEPT BANK — OLD TESTAMENT
   Each concept is tested from several angles so mastery cannot be faked by
   memorising one answer. Probe types:
     mc  multiple choice      tf  true/false        who  who am I
     nxt what happened next   cse cause & effect    scn  scenario
     con connection           bok book id           fil  fill in the blank
     ord put in order         mat matching          exp  explain your answer
   `l` = the knowledge level the probe tests (1 recall … 5 transfer).
   ========================================================================== */

const CONCEPTS_OT = [

/* ===================== CREATION & EARLY HISTORY ===================== */
{id:'c_creation',b:'gen',e:'creation',topic:'Creation',d:1,claim:'text',ref:'Genesis 1–2',
 sum:'God creates the heavens and the earth over six days, makes humanity in his own image as male and female, and rests on the seventh day.',
 p:[
 {t:'mc',l:1,q:'In Genesis 1, what does God call the light that he separates from the darkness?',o:['Day','Morning','Heaven','Life'],a:0,w:'God names the light "day" and the darkness "night" on the first day (Gen 1:5).'},
 {t:'tf',l:2,q:'According to Genesis 1, humanity was created on the sixth day, after the land animals.',o:['True','False'],a:0,w:'Land animals and then humanity are both made on day six (Gen 1:24-31).'},
 {t:'ord',l:3,q:'Put the days of creation in the order Genesis 1 gives them.',it:['Light separated from darkness','Sky separating the waters','Dry land and vegetation','Sun, moon and stars','Sea creatures and birds','Land animals and humanity'],w:'Genesis 1 moves from forming environments (days 1–3) to filling them (days 4–6) — a deliberate pattern.'},
 {t:'cse',l:4,q:'Genesis 2:1-3 says God rested on the seventh day and made it holy. Which later command is explicitly grounded in that pattern?',o:['The Sabbath command in Exodus 20:8-11','The Passover in Exodus 12','The Day of Atonement in Leviticus 16','The Jubilee in Leviticus 25'],a:0,w:'Exodus 20:11 gives the creation week as the reason for the Sabbath command.'},
 {t:'exp',l:5,q:'Why does it matter that Genesis 1 says humanity was made in God\u2019s image, rather than just saying humanity was made?',keys:['image','value','dignity','represent','rule','relationship','all people'],
  model:'Genesis 1:26-27 gives humanity a status the rest of creation is not given: made in God\u2019s image, male and female, and charged to rule and care for the earth. That grounds human dignity in something other than usefulness or ability, applies equally to every person, and frames human work as representing God within creation.'}
]},
{id:'c_image',b:'gen',e:'creation',topic:'Image of God',d:2,claim:'text',ref:'Genesis 1:26-27',
 sum:'Humanity — male and female — is made in God\u2019s image and given responsibility to rule over and care for the earth.',
 p:[
 {t:'fil',l:1,q:'Genesis 1:27 says God created humanity in his own ______, male and female.',o:['image','likeness of angels','shadow','name'],a:0,w:'The phrase is "in his own image" (Gen 1:27).'},
 {t:'scn',l:4,q:'A friend argues that human worth depends on what a person can contribute. How does Genesis 1:26-27 speak to that?',o:['Worth is grounded in bearing God\u2019s image, not in output','Worth is earned through obedience to the law','Only the strong were made in God\u2019s image','Genesis does not address human worth'],a:0,w:'The image is given at creation to humanity as such, before any achievement.'},
 {t:'con',l:4,q:'Which later text draws on the image of God as a reason not to curse other people?',o:['James 3:9','Psalm 23','Ecclesiastes 3','Ruth 1'],a:0,w:'James 3:9 objects that we bless God and curse people who are made in his likeness.'}
]},
{id:'c_fall',b:'gen',e:'creation',topic:'The fall',d:1,claim:'text',ref:'Genesis 3',
 sum:'The serpent questions God\u2019s command, Adam and Eve eat from the forbidden tree, and the result is shame, blame, curse and exile from the garden.',
 p:[
 {t:'mc',l:1,q:'What was the one tree Adam and Eve were told not to eat from?',o:['The tree of the knowledge of good and evil','The tree of life','The fig tree','The olive tree'],a:0,w:'Genesis 2:17 forbids the tree of the knowledge of good and evil. The tree of life is a different tree.'},
 {t:'cse',l:3,q:'What does the serpent do first in Genesis 3, before suggesting anything?',o:['Questions what God actually said','Offers Eve fruit directly','Attacks Adam','Promises them a kingdom'],a:0,w:'The first move is a question — "Did God really say…?" (Gen 3:1) — casting doubt before offering anything.'},
 {t:'nxt',l:2,q:'Immediately after Adam and Eve eat, what does Genesis 3 report?',o:['Their eyes are opened and they realise they are naked','A flood begins','Cain is born','God destroys the garden'],a:0,w:'Genesis 3:7 — their eyes are opened, they know they are naked, and they sew fig leaves.'},
 {t:'ord',l:3,q:'Put the events of Genesis 3 in order.',it:['The serpent questions God\u2019s command','Eve and Adam eat the fruit','They hide from God among the trees','Adam blames Eve, Eve blames the serpent','God pronounces consequences','They are sent out of the garden'],w:'The sequence moves from doubt to disobedience to hiding to blame to consequence to exile.'},
 {t:'exp',l:5,q:'How does the pattern in Genesis 3 — doubt, disobedience, hiding, blame — show up in ordinary life?',keys:['doubt','question','hide','blame','shame','excuse','responsibility'],
  model:'The chapter traces a repeatable pattern rather than a one-off event: a suggestion that God\u2019s word can\u2019t be trusted, then acting on it, then concealment, then shifting responsibility onto someone else. Naming the pattern helps a reader recognise the same moves in themselves — especially the instinct to hide and to blame instead of admitting what happened.'}
]},
{id:'c_cain',b:'gen',e:'creation',topic:'Cain and Abel',d:2,claim:'text',ref:'Genesis 4',
 sum:'Cain\u2019s offering is not accepted while Abel\u2019s is; God warns Cain that sin is crouching at the door, but Cain kills his brother.',
 p:[
 {t:'who',l:2,clues:['I was a keeper of sheep','My offering was accepted','My brother killed me in a field','Hebrews 11 lists me first among the faithful'],o:['Abel','Seth','Enoch','Cain'],a:0,w:'Abel — Hebrews 11:4 names him first in its list of faith.'},
 {t:'cse',l:3,q:'What does God say to Cain before the murder?',o:['That sin is crouching at the door and he must rule over it','That Abel will be given the birthright','That he must leave immediately','Nothing at all'],a:0,w:'Genesis 4:7 — a warning and a call to master it, given before the act.'},
 {t:'con',l:4,q:'Genesis 4 sits directly after Genesis 3. What does its placement show about sin?',o:['It spreads and escalates from disobedience to violence','It was resolved at the end of Genesis 3','It affected only Adam','It disappeared until the flood'],a:0,w:'Genesis 3–11 traces sin widening: one couple, then a family, then a whole violent world.'}
]},
{id:'c_flood',b:'gen',e:'creation',topic:'The flood',d:1,claim:'text',ref:'Genesis 6–9',
 sum:'Human violence fills the earth; God tells Noah to build an ark, sends a flood, and preserves Noah\u2019s family and the animals.',
 p:[
 {t:'mc',l:1,q:'Why does Genesis 6 say God decided to send the flood?',o:['The earth was filled with violence and corruption','People had stopped farming','A famine had begun','Noah asked him to'],a:0,w:'Genesis 6:11-13 — the earth was corrupt and full of violence.'},
 {t:'cse',l:3,q:'Why did Noah build the ark?',o:['God told him a flood was coming and gave him instructions','He wanted to explore the sea','His neighbours hired him','To escape a famine in Canaan'],a:0,w:'Genesis 6:13-22 — Noah was warned and given specific instructions, and did all God commanded.'},
 {t:'nxt',l:3,q:'What happens immediately after Noah leaves the ark?',o:['He builds an altar and offers sacrifices','He builds a city','He travels to Egypt','He divides the land among his sons'],a:0,w:'Genesis 8:20 — the first thing recorded is an altar.'},
 {t:'ord',l:3,q:'Put Noah\u2019s major events in order.',it:['God tells Noah to build the ark','The animals and family enter','The waters cover the earth','The ark comes to rest on the mountains of Ararat','A dove returns with an olive leaf','Noah builds an altar','God gives the rainbow sign'],w:'The order matters: rescue, resting, testing the waters, worship, then covenant.'},
 {t:'bok',l:2,q:'Which book contains the account of the flood?',o:['Genesis','Exodus','Job','Joshua'],a:0,w:'Genesis 6–9.'}
]},
{id:'c_noah_cov',b:'gen',e:'creation',topic:'Noah\u2019s covenant',d:2,claim:'text',ref:'Genesis 9:8-17',
 sum:'God promises never again to destroy the earth by flood and gives the rainbow as the sign of that covenant with every living creature.',
 p:[
 {t:'mc',l:1,q:'What is the sign of God\u2019s covenant with Noah?',o:['A rainbow in the clouds','A stone altar','Circumcision','A pillar of fire'],a:0,w:'Genesis 9:13 — the bow in the cloud.'},
 {t:'tf',l:2,q:'God\u2019s covenant after the flood is made with Noah\u2019s family only.',o:['True','False'],a:1,w:'False — Genesis 9:9-10 includes every living creature and the earth itself.'},
 {t:'con',l:4,q:'How does the Noah covenant differ in scope from the covenant with Abraham?',o:['Noah\u2019s covers all creation; Abraham\u2019s centres on one family through whom nations are blessed','They cover exactly the same people','Abraham\u2019s is universal and Noah\u2019s is national','Neither involves a sign'],a:0,w:'Genesis 9 is universal; Genesis 12 and 17 narrow to one family with a worldwide purpose.'},
 {t:'exp',l:5,q:'What does the rainbow covenant say about how God relates to a world that is still broken?',keys:['unconditional','promise','all creation','patience','sign','mercy','not destroy'],
  model:'The promise is made after the flood, to a world God knows is still inclined toward evil (Gen 8:21). Nothing is required of Noah in return, and the sign is set in the sky where anyone can see it. It shows God committing himself to preserve creation rather than repeatedly wipe it out — restraint and patience rather than a fixed problem.'}
]},
{id:'c_babel',b:'gen',e:'creation',topic:'Tower of Babel',d:2,claim:'text',ref:'Genesis 11:1-9',
 sum:'People with one language build a city and tower to make a name for themselves and avoid being scattered; God confuses their language and scatters them.',
 p:[
 {t:'mc',l:1,q:'What reason do the builders themselves give for building the tower?',o:['To make a name for themselves and not be scattered','To reach the moon','To store grain','To honour Noah'],a:0,w:'Genesis 11:4 — a name for themselves, and to avoid being scattered.'},
 {t:'cse',l:3,q:'What is the direct result of God confusing their language?',o:['They stop building and are scattered over the earth','They finish the tower faster','They return to Ararat','A flood begins'],a:0,w:'Genesis 11:8 — they leave off building the city and are scattered.'},
 {t:'nxt',l:4,q:'Immediately after Babel, what does Genesis turn to?',o:['The family line leading to Abram and his call','The exodus from Egypt','The reign of David','The building of the temple'],a:0,w:'Genesis 11:10-32 gives Shem\u2019s line down to Abram, and Genesis 12 calls him — scattering answered by one chosen family.'},
 {t:'con',l:5,q:'Which New Testament event is often read as a deliberate reversal of Babel?',o:['Pentecost, where people hear one message in many languages','The transfiguration','The feeding of the five thousand','The Jerusalem council'],a:0,w:'At Pentecost (Acts 2:5-11) the language barrier is crossed rather than created. Many Christians read this as an intentional echo; the text does not state the link outright.'}
]},

/* ============================== PATRIARCHS ============================== */
{id:'c_call_abram',b:'gen',e:'patriarchs',topic:'Call of Abram',d:1,claim:'text',ref:'Genesis 12:1-3',
 sum:'God tells Abram to leave his country and family for a land he will be shown, promising to make him a great nation and to bless all peoples through him.',
 p:[
 {t:'mc',l:1,q:'What is Abram told to leave in Genesis 12?',o:['His country, his relatives and his father\u2019s house','His flocks','His name','His tent'],a:0,w:'Genesis 12:1 names all three, moving from broadest to most personal.'},
 {t:'fil',l:2,q:'Genesis 12:3 promises that through Abram all the families of the earth will be ______.',o:['blessed','counted','judged','numbered'],a:0,w:'"Blessed" — the promise reaches beyond one family from the start.'},
 {t:'con',l:4,q:'Why do Paul and other New Testament writers keep returning to Genesis 12:3?',o:['It promises blessing to all nations, which they see fulfilled as Gentiles come to faith','It records the giving of the law','It names the twelve tribes','It describes the temple'],a:0,w:'Galatians 3:8 explicitly reads Genesis 12:3 as the gospel announced in advance.'},
 {t:'scn',l:4,q:'Abram was around seventy-five and childless when he was told he would become a great nation. What does that highlight?',o:['The promise depended on God, not on Abram\u2019s circumstances','Abram had already achieved greatness','The promise was meant symbolically only','Abram negotiated better terms'],a:0,w:'The gap between promise and visible evidence is the point the New Testament later builds on (Rom 4:18-21).'}
]},
{id:'c_abr_cov',b:'gen',e:'patriarchs',topic:'Covenant with Abraham',d:2,claim:'text',ref:'Genesis 15; 17',
 sum:'God formally covenants with Abram — offspring as numerous as the stars, and a land — and Abram\u2019s belief is credited to him as righteousness. Circumcision becomes the covenant sign.',
 p:[
 {t:'mc',l:1,q:'What sign is given for the covenant in Genesis 17?',o:['Circumcision','A rainbow','A stone pillar','A cloud'],a:0,w:'Genesis 17:10-11.'},
 {t:'fil',l:2,q:'Genesis 15:6 says Abram believed the LORD, and it was credited to him as ______.',o:['righteousness','wisdom','strength','an inheritance'],a:0,w:'This short line becomes the backbone of Paul\u2019s argument in Romans 4.'},
 {t:'con',l:5,q:'Paul uses Genesis 15:6 in Romans 4 to argue what?',o:['Abraham was counted righteous by faith before circumcision was given','Abraham earned righteousness by obedience','Circumcision saves','The covenant was only for one nation'],a:0,w:'Paul\u2019s point turns on the order of events: faith counted first, sign given later.'},
 {t:'mat',l:4,q:'Match each covenant to its sign.',pr:[['Noah','The rainbow'],['Abraham','Circumcision'],['Sinai/Moses','The Sabbath and the tablets of the law'],['New covenant (Jer 31)','The law written on hearts']],w:'Each covenant carries an identifying sign; comparing them shows how the story develops.'}
]},
{id:'c_isaac',b:'gen',e:'patriarchs',topic:'Isaac',d:2,claim:'text',ref:'Genesis 21–22',
 sum:'Isaac is born to Abraham and Sarah in old age, the son through whom the promise runs; later God tests Abraham by telling him to offer Isaac on a mountain in Moriah, then provides a ram instead.',
 p:[
 {t:'mc',l:1,q:'What does God provide in place of Isaac on the mountain?',o:['A ram caught in a thicket','A dove','A lamb from Abraham\u2019s flock','A bull'],a:0,w:'Genesis 22:13.'},
 {t:'who',l:2,clues:['I was born when my parents were very old','My name means laughter','I was carried up a mountain by my father','My sons were twins who struggled before birth'],o:['Isaac','Jacob','Ishmael','Joseph'],a:0,w:'Isaac — Sarah laughed at the promise, and the name reflects it (Gen 21:6).'},
 {t:'cse',l:3,q:'Why does Genesis 22 matter so much for the promise?',o:['Isaac was the son the whole promise depended on, so the command put the promise itself at risk','Isaac was Abraham\u2019s only child by any wife','It established the priesthood','It gave Israel its borders'],a:0,w:'God had said the offspring would come through Isaac (Gen 21:12), which is what makes the test so severe.'},
 {t:'con',l:5,q:'Christians have long noticed parallels between Genesis 22 and the crucifixion. How should that be described?',o:['A widely held Christian reading, drawn by connection rather than stated by Genesis','A claim Genesis makes explicitly','A view unique to one modern denomination','A rejected interpretation'],a:0,w:'The parallels (a beloved son, wood carried uphill, a provided substitute) are drawn by readers; Genesis 22 does not state them.'}
]},
{id:'c_jacob',b:'gen',e:'patriarchs',topic:'Jacob',d:2,claim:'text',ref:'Genesis 25–33',
 sum:'Jacob buys Esau\u2019s birthright, takes his blessing by deception, flees to Haran, dreams of a stairway at Bethel, works twenty years for Laban, and wrestles at Peniel where he is renamed Israel.',
 p:[
 {t:'mc',l:1,q:'What does Jacob see in his dream at Bethel?',o:['A stairway between earth and heaven with angels on it','A burning bush','Seven cows','A wheel of fire'],a:0,w:'Genesis 28:12.'},
 {t:'nxt',l:3,q:'After deceiving Isaac to get Esau\u2019s blessing, what does Jacob do next?',o:['Flees to Haran, to his uncle Laban','Becomes king','Goes to Egypt','Apologises publicly to Esau'],a:0,w:'Genesis 27:43-45 — Rebekah sends him away to escape Esau.'},
 {t:'ord',l:4,q:'Put Jacob\u2019s life events in order.',it:['Buys Esau\u2019s birthright for stew','Receives Isaac\u2019s blessing by deception','Dreams of the stairway at Bethel','Works fourteen years for Rachel and Leah','Wrestles at Peniel and is renamed Israel','Is reconciled with Esau','Moves the family to Egypt'],w:'Jacob\u2019s story runs from grasping to being changed, with the new name coming near the end of the struggle.'},
 {t:'cse',l:4,q:'Jacob deceived his father using clothing and disguise. What later happens to him in Genesis 29?',o:['He is deceived by Laban with a veiled bride','He loses his flocks','He is imprisoned','He forgets his own name'],a:0,w:'Genesis 29:23-25 — the deceiver is deceived, a pattern the narrative seems to set up deliberately.'}
]},
{id:'c_israel_name',b:'gen',e:'patriarchs',topic:'The name Israel',d:2,claim:'text',ref:'Genesis 32:22-32',
 sum:'After wrestling through the night at Peniel, Jacob is renamed Israel and walks away limping.',
 p:[
 {t:'mc',l:1,q:'Where is Jacob renamed Israel?',o:['At Peniel, after wrestling through the night','At Bethel','In Egypt','On Mount Sinai'],a:0,w:'Genesis 32:28-30.'},
 {t:'tf',l:2,q:'Jacob came away from the wrestling match uninjured.',o:['True','False'],a:1,w:'False — his hip was wrenched and he walked with a limp (Gen 32:31).'},
 {t:'con',l:4,q:'Why does the renaming matter for the rest of the Bible?',o:['The nation descended from him is called Israel','It ended the famine','It founded the priesthood','It marked the start of the exile'],a:0,w:'The whole people take their name from this moment.'}
]},
{id:'c_joseph',b:'gen',e:'patriarchs',topic:'Joseph',d:1,claim:'text',ref:'Genesis 37–50',
 sum:'Joseph is sold by his brothers, serves Potiphar, is imprisoned on a false accusation, interprets Pharaoh\u2019s dreams, becomes second in Egypt, and saves his family during famine.',
 p:[
 {t:'mc',l:1,q:'Why do Joseph\u2019s brothers sell him?',o:['Jealousy over his father\u2019s favouritism and his dreams','He stole from them','He refused to work','Pharaoh demanded it'],a:0,w:'Genesis 37:4-11 — the robe and the dreams both fuel their hatred.'},
 {t:'ord',l:3,q:'Put Joseph\u2019s major events in order.',it:['Receives a special robe from Jacob','Is sold by his brothers','Serves in Potiphar\u2019s house','Is imprisoned after a false accusation','Interprets Pharaoh\u2019s dreams','Is made second in command over Egypt','Reveals himself to his brothers'],w:'The fall-and-rise shape runs twice: sold then trusted, imprisoned then promoted.'},
 {t:'cse',l:3,q:'What gets Joseph out of prison?',o:['His interpretation of Pharaoh\u2019s dreams, remembered by the cupbearer','A bribe','An earthquake','Potiphar\u2019s pardon'],a:0,w:'Genesis 41:9-14 — the cupbearer finally remembers him.'},
 {t:'who',l:2,clues:['My brothers threw me into a pit','I interpreted dreams in prison','I administered grain during seven years of famine','I told my brothers that what they meant for evil, God meant for good'],o:['Joseph','Daniel','Nehemiah','Moses'],a:0,w:'Joseph — Genesis 50:20 is the line that sums up his story.'},
 {t:'bok',l:2,q:'Which book tells Joseph\u2019s story?',o:['Genesis','Exodus','Numbers','Judges'],a:0,w:'Genesis 37–50 closes the book.'}
]},
{id:'c_joseph_good',b:'gen',e:'patriarchs',topic:'God\u2019s purpose through evil',d:3,claim:'text',ref:'Genesis 50:20',
 sum:'Joseph tells his brothers that what they intended for harm, God intended for good, to preserve many lives.',
 p:[
 {t:'fil',l:2,q:'Joseph says: you intended to harm me, but God intended it for ______.',o:['good','judgment','a sign','later'],a:0,w:'Genesis 50:20.'},
 {t:'scn',l:5,q:'Someone says Genesis 50:20 means the brothers did nothing wrong. What is the problem with that reading?',o:['Joseph names their intent as harm; God\u2019s purpose does not erase their responsibility','Joseph never mentions their intent','The verse says they acted rightly','Genesis omits their motives'],a:0,w:'Both halves of the sentence stand: real wrong done, and real good brought out of it.'},
 {t:'con',l:5,q:'Which New Testament verse is most often read alongside Genesis 50:20?',o:['Romans 8:28','Matthew 5:3','John 11:35','Acts 1:8'],a:0,w:'Romans 8:28 — God working in all things for good — is the usual pairing.'}
]},
{id:'c_melchizedek',b:'gen',e:'patriarchs',topic:'Melchizedek',d:3,claim:'text',ref:'Genesis 14:18-20',
 sum:'Melchizedek, king of Salem and priest of God Most High, brings out bread and wine and blesses Abram, who gives him a tenth of everything.',
 p:[
 {t:'mc',l:2,q:'Who is Melchizedek in Genesis 14?',o:['King of Salem and priest of God Most High','Pharaoh\u2019s advisor','Abram\u2019s brother','A king of Egypt'],a:0,w:'Genesis 14:18.'},
 {t:'con',l:5,q:'Which New Testament book builds a long argument on Melchizedek?',o:['Hebrews','James','Revelation','1 Peter'],a:0,w:'Hebrews 5–7 uses him to argue for a priesthood older and other than Aaron\u2019s.'},
 {t:'bok',l:3,q:'Melchizedek appears in only three places in the Bible. Which set is correct?',o:['Genesis 14, Psalm 110, Hebrews','Genesis 14, Exodus 3, Romans','Numbers 21, Psalm 23, Acts','Joshua 2, Isaiah 6, John'],a:0,w:'Genesis 14, Psalm 110:4, and Hebrews 5–7.'}
]},

/* ============================ EXODUS & LAW ============================ */
{id:'c_moses_birth',b:'exo',e:'exodus',topic:'Moses\u2019 early life',d:2,claim:'text',ref:'Exodus 2',
 sum:'Born under a death decree, Moses is hidden, set adrift in a basket, raised in Pharaoh\u2019s household, and flees to Midian after killing an Egyptian.',
 p:[
 {t:'mc',l:1,q:'Who draws Moses out of the Nile?',o:['Pharaoh\u2019s daughter','Miriam','Jochebed','Zipporah'],a:0,w:'Exodus 2:5-6; his sister Miriam watches and arranges for his own mother to nurse him.'},
 {t:'nxt',l:3,q:'After Moses kills an Egyptian who was beating a Hebrew, what happens next?',o:['He flees to Midian','He is made a prince','He confesses to Pharaoh','He returns to his mother'],a:0,w:'Exodus 2:15 — Pharaoh seeks to kill him, so he escapes to Midian.'},
 {t:'cse',l:3,q:'Why were Hebrew baby boys being killed in Exodus 1?',o:['Pharaoh feared the growing Israelite population','A famine required rationing','A plague had spread','The Israelites had rebelled'],a:0,w:'Exodus 1:9-10, 22 — fear of their numbers drives the decree.'}
]},
{id:'c_bush',b:'exo',e:'exodus',topic:'The burning bush',d:1,claim:'text',ref:'Exodus 3–4',
 sum:'God speaks from a bush that burns without being consumed, commissions Moses to bring Israel out of Egypt, and gives his name: I AM WHO I AM.',
 p:[
 {t:'mc',l:1,q:'What was unusual about the bush Moses saw?',o:['It burned but was not consumed','It grew in the sea','It spoke in Egyptian','It bore fruit in winter'],a:0,w:'Exodus 3:2.'},
 {t:'mc',l:2,q:'What name does God give Moses at the bush?',o:['I AM WHO I AM','El Shaddai','Adonai Tsebaoth','The Ancient of Days'],a:0,w:'Exodus 3:14, connected to the covenant name LORD.'},
 {t:'cse',l:3,q:'What is Moses\u2019 repeated response to the commission?',o:['Objections — who am I, what if they don\u2019t believe me, I am not eloquent','Immediate enthusiasm','Silence','A demand for payment'],a:0,w:'Exodus 3:11 – 4:13 records a string of objections before Moses goes.'},
 {t:'con',l:4,q:'Where else in the Bible does a significant event happen at this same mountain?',o:['The law is given there, and Elijah later hears a low whisper there','Jesus is transfigured there','The temple is built there','Noah\u2019s ark rests there'],a:0,w:'Sinai/Horeb is the site of the burning bush, the covenant (Exo 19–20) and Elijah\u2019s encounter (1 Kgs 19).'}
]},
{id:'c_plagues',b:'exo',e:'exodus',topic:'The ten plagues',d:2,claim:'text',ref:'Exodus 7–12',
 sum:'Ten plagues fall on Egypt as Pharaoh repeatedly refuses to let Israel go, ending with the death of the firstborn.',
 p:[
 {t:'mc',l:1,q:'What was the first plague?',o:['The Nile turned to blood','Frogs','Darkness','Hail'],a:0,w:'Exodus 7:20-21.'},
 {t:'mc',l:2,q:'What was the tenth and final plague?',o:['Death of the firstborn','Locusts','Boils','Gnats'],a:0,w:'Exodus 12:29 — the plague that finally moves Pharaoh.'},
 {t:'ord',l:3,q:'Put these plagues in the order Exodus gives them.',it:['Water turned to blood','Frogs','Hail','Locusts','Darkness','Death of the firstborn'],w:'Exodus lists ten in a fixed order; these six appear first, third-from-last, and last in that sequence.'},
 {t:'cse',l:4,q:'Exodus repeatedly gives a stated purpose for the plagues. What is it?',o:['That Egypt and Israel would know who the LORD is','To enrich Israel','To destroy the Nile permanently','To test Moses\u2019 patience'],a:0,w:'Exodus 7:5 and similar verses state the purpose as knowing the LORD.'}
]},
{id:'c_passover',b:'exo',e:'exodus',topic:'The Passover',d:1,claim:'text',ref:'Exodus 12',
 sum:'Each household takes a lamb, puts its blood on the doorframes, and eats in haste; the destroyer passes over those houses, and the meal becomes an annual remembrance.',
 p:[
 {t:'mc',l:1,q:'What were the Israelites told to put on their doorframes?',o:['The blood of a lamb','Olive oil','Ashes','Salt'],a:0,w:'Exodus 12:7.'},
 {t:'cse',l:3,q:'Why was the Passover meal to be repeated every year?',o:['As a remembrance so later generations would know what God had done','To mark the harvest','To honour Pharaoh\u2019s decree','To count the tribes'],a:0,w:'Exodus 12:14, 26-27 — the meal exists to prompt the question "what does this mean?"'},
 {t:'con',l:5,q:'Which New Testament meal takes place at Passover and reinterprets its elements?',o:['The last supper','The wedding at Cana','The feeding of the five thousand','The breakfast on the beach'],a:0,w:'Luke 22:7-20 sets the last supper at Passover, and Jesus gives the bread and cup new meaning.'},
 {t:'scn',l:5,q:'John the Baptist calls Jesus "the Lamb of God." Which Old Testament background does this most directly draw on?',o:['Passover and the sacrificial system','The tower of Babel','The judges cycle','Solomon\u2019s temple plans'],a:0,w:'The lamb imagery reaches back to Passover and Israel\u2019s sacrifices; John 1:29. This is a widely held Christian reading.'}
]},
{id:'c_redsea',b:'exo',e:'exodus',topic:'Crossing the sea',d:1,claim:'text',ref:'Exodus 14',
 sum:'Trapped between the sea and Pharaoh\u2019s army, Israel crosses on dry ground as the waters divide; the pursuing army is drowned.',
 p:[
 {t:'mc',l:1,q:'What does Moses do at God\u2019s command before the waters divide?',o:['Stretches out his hand over the sea','Strikes a rock','Blows a trumpet','Builds a raft'],a:0,w:'Exodus 14:16, 21.'},
 {t:'nxt',l:3,q:'What happens immediately after Israel reaches the far shore?',o:['Moses and Miriam lead songs of victory','They arrive at Sinai','They build the tabernacle','They choose a king'],a:0,w:'Exodus 15 — the song of Moses, then Miriam with the tambourine.'},
 {t:'ord',l:4,q:'Put these exodus events in order.',it:['The burning bush','The ten plagues','The first Passover','Crossing the sea','Manna in the wilderness','The Ten Commandments at Sinai','The golden calf'],w:'Rescue comes before law: Israel is freed first, then given the covenant.'}
]},
{id:'c_manna',b:'exo',e:'exodus',topic:'Manna and water',d:2,claim:'text',ref:'Exodus 16–17',
 sum:'God provides manna each morning and water from a rock, while Israel grumbles about food and thirst.',
 p:[
 {t:'mc',l:1,q:'How often were the Israelites to gather manna?',o:['Each morning, with a double portion before the Sabbath','Once a month','Only on festivals','Whenever they wanted'],a:0,w:'Exodus 16:4-5, 22-26.'},
 {t:'cse',l:3,q:'What does Exodus say the manna was meant to test?',o:['Whether Israel would follow God\u2019s instructions','Their strength','Their farming skill','Their numbers'],a:0,w:'Exodus 16:4 states the purpose as a test of obedience.'},
 {t:'con',l:5,q:'Which of Jesus\u2019 "I am" sayings deliberately echoes the manna?',o:['I am the bread of life','I am the door','I am the true vine','I am the good shepherd'],a:0,w:'John 6:31-35 quotes the manna account directly before the saying.'}
]},
{id:'c_sinai',b:'exo',e:'exodus',topic:'Sinai and the Ten Commandments',d:1,claim:'text',ref:'Exodus 19–20',
 sum:'Three months after leaving Egypt, Israel camps at Sinai, God comes down in fire and cloud, and gives the Ten Commandments and the covenant law.',
 p:[
 {t:'mc',l:1,q:'Where does Israel receive the Ten Commandments?',o:['Mount Sinai','Mount Carmel','Mount Zion','Mount Nebo'],a:0,w:'Exodus 19–20; the mountain is also called Horeb.'},
 {t:'mc',l:2,q:'How does Exodus 20 open the Ten Commandments?',o:['With a reminder that God brought Israel out of Egypt','With a warning about the sea','With a census','With a description of the tabernacle'],a:0,w:'Exodus 20:2 — the rescue is stated before the commands, framing law as a response to grace.'},
 {t:'cse',l:4,q:'Why does the order matter — rescue first, then law?',o:['The commands are given to a people already redeemed, not as a way to earn rescue','It shows the law came from Egypt','It proves Israel bargained with God','It marks the start of the monarchy'],a:0,w:'This ordering is heavily used in New Testament arguments about grace and obedience.'},
 {t:'exp',l:5,q:'Someone says the Ten Commandments are just an ancient rule list. Using Exodus 19–20, give a fuller answer.',keys:['covenant','relationship','rescue','Egypt','identity','God first','neighbour'],
  model:'Exodus frames the commands inside a covenant. God first identifies himself as the one who brought Israel out of Egypt, then gives commands that shape a rescued people\u2019s life — the first group about loyalty to God, the second about how to treat other people. They are terms of a relationship rather than a standalone legal code, which is why later writers can summarise them as loving God and loving neighbour.'}
]},
{id:'c_calf',b:'exo',e:'exodus',topic:'The golden calf',d:2,claim:'text',ref:'Exodus 32',
 sum:'While Moses is on the mountain, the people press Aaron to make gods for them; he makes a golden calf, and Moses intercedes when God threatens judgment.',
 p:[
 {t:'mc',l:1,q:'Who makes the golden calf?',o:['Aaron','Joshua','Miriam','Korah'],a:0,w:'Exodus 32:2-4, at the people\u2019s insistence.'},
 {t:'cse',l:3,q:'What prompts the people to demand an idol?',o:['Moses had been on the mountain a long time and they did not know what had become of him','A famine','An attack','A command from Aaron'],a:0,w:'Exodus 32:1 gives their reason directly.'},
 {t:'nxt',l:4,q:'What does Moses do when God threatens to destroy the people?',o:['He intercedes and appeals to God\u2019s promises','He agrees','He leaves for Midian','He crowns Aaron'],a:0,w:'Exodus 32:11-14 — Moses appeals to God\u2019s reputation and his promise to Abraham, Isaac and Jacob.'},
 {t:'scn',l:5,q:'The calf incident happens right after the covenant was made. What does that placement emphasise?',o:['How quickly a rescued people can turn, and how central intercession and mercy become','That the covenant was never real','That Aaron was the only guilty party','That the law had failed'],a:0,w:'The timing is the point — the ink is barely dry, which is why the chapters that follow deal with mercy and God\u2019s continued presence.'}
]},
{id:'c_tabernacle',b:'exo',e:'exodus',topic:'The tabernacle',d:2,claim:'text',ref:'Exodus 25–40',
 sum:'God gives detailed instructions for a portable sanctuary so that he may dwell among his people; when it is finished, his glory fills it.',
 p:[
 {t:'mc',l:2,q:'What reason does Exodus 25:8 give for building the sanctuary?',o:['So that God may dwell among his people','To store the harvest','To house the army','To display Israel\u2019s wealth'],a:0,w:'Presence is the stated purpose.'},
 {t:'mc',l:2,q:'What happens when the tabernacle is completed at the end of Exodus?',o:['The cloud covers it and God\u2019s glory fills it','It is immediately dismantled','It is carried into Canaan','Fire destroys it'],a:0,w:'Exodus 40:34-35.'},
 {t:'con',l:5,q:'Which New Testament book reads the tabernacle as a shadow of something greater?',o:['Hebrews','1 Corinthians','Jude','Titus'],a:0,w:'Hebrews 8–10 treats the sanctuary and its sacrifices as a copy pointing forward.'},
 {t:'mat',l:4,q:'Match each tabernacle item to its function.',pr:[['The ark of the covenant','Held the tablets; the place of God\u2019s meeting with Israel'],['The bronze altar','Where sacrifices were offered'],['The lampstand','Gave continual light in the holy place'],['The curtain (veil)','Separated the most holy place']],w:'Each item has a stated role in Exodus 25–30.'}
]},
{id:'c_atonement',b:'lev',e:'exodus',topic:'Day of Atonement',d:3,claim:'text',ref:'Leviticus 16',
 sum:'Once a year the high priest enters the most holy place with blood, and a second goat carries the people\u2019s sins away into the wilderness.',
 p:[
 {t:'mc',l:2,q:'On the Day of Atonement, what happens to the second goat?',o:['It is sent away into the wilderness carrying the people\u2019s sins','It is kept in the tabernacle','It is given to the priests','It is released into a field of the temple'],a:0,w:'Leviticus 16:21-22 — the scapegoat.'},
 {t:'tf',l:2,q:'The high priest could enter the most holy place any time he wished.',o:['True','False'],a:1,w:'False — Leviticus 16:2 restricts entry to the appointed day and manner.'},
 {t:'con',l:5,q:'Hebrews 9 uses the Day of Atonement to make which argument?',o:['Christ entered once for all, unlike a priest who repeated the ritual yearly','The ritual should be revived','The high priest was unnecessary','Sin was never taken seriously'],a:0,w:'The contrast is repetition versus a single decisive act.'},
 {t:'bok',l:3,q:'Which book contains the Day of Atonement instructions?',o:['Leviticus','Numbers','Deuteronomy','Joshua'],a:0,w:'Leviticus 16.'}
]},
{id:'c_spies',b:'num',e:'exodus',topic:'The twelve spies',d:2,claim:'text',ref:'Numbers 13–14',
 sum:'Twelve scouts explore Canaan; ten report that the people are too strong, while Joshua and Caleb urge going up. Israel refuses, and that generation spends forty years in the wilderness.',
 p:[
 {t:'mc',l:1,q:'Which two spies urged Israel to go up and take the land?',o:['Joshua and Caleb','Aaron and Miriam','Korah and Dathan','Nadab and Abihu'],a:0,w:'Numbers 14:6-9.'},
 {t:'cse',l:3,q:'Why did Israel spend forty years in the wilderness?',o:['They refused to enter the land after the spies\u2019 report','The route was impassable','Egypt pursued them','Moses got lost'],a:0,w:'Numbers 14:33-34 ties the forty years to the forty days of scouting.'},
 {t:'nxt',l:4,q:'Who leads Israel into the land after that generation dies?',o:['Joshua','Caleb','Aaron','Samuel'],a:0,w:'Joshua — one of the two faithful spies — leads the crossing in Joshua 3.'},
 {t:'con',l:5,q:'Which New Testament passage uses the wilderness generation as a warning to Christians?',o:['1 Corinthians 10','Romans 9','Revelation 4','Philemon'],a:0,w:'1 Corinthians 10:1-12 draws directly on the wilderness as an example.'}
]},
{id:'c_bronze',b:'num',e:'exodus',topic:'The bronze serpent',d:3,claim:'text',ref:'Numbers 21:4-9',
 sum:'After the people complain, venomous snakes come among them; God tells Moses to make a bronze serpent on a pole, and those who look at it live.',
 p:[
 {t:'mc',l:2,q:'What were the Israelites told to do to be healed from the snake bites?',o:['Look at the bronze serpent Moses lifted up','Drink from a spring','Offer a lamb','Fast for three days'],a:0,w:'Numbers 21:8-9.'},
 {t:'con',l:5,q:'Which verse in John draws directly on this event?',o:['John 3:14','John 1:1','John 11:25','John 21:15'],a:0,w:'John 3:14 compares the lifting up of the serpent to the Son of Man being lifted up.'},
 {t:'nxt',l:4,q:'2 Kings 18 records what eventually happened to the bronze serpent.',o:['Hezekiah destroyed it because people had begun burning incense to it','It was placed in the ark','It was lost in the flood','It was taken to Babylon'],a:0,w:'2 Kings 18:4 — a rescue object became an idol and had to go.'}
]},
{id:'c_shema',b:'deu',e:'exodus',topic:'The Shema',d:2,claim:'text',ref:'Deuteronomy 6:4-9',
 sum:'"Hear, O Israel: the LORD our God, the LORD is one" — followed by the command to love God with all your heart, soul and strength, and to teach it constantly at home.',
 p:[
 {t:'fil',l:1,q:'Deuteronomy 6:5 commands Israel to love the LORD with all their heart, soul and ______.',o:['strength','wealth','learning','days'],a:0,w:'Heart, soul and strength (Deut 6:5).'},
 {t:'con',l:4,q:'When asked for the greatest commandment, what does Jesus quote first?',o:['The Shema from Deuteronomy 6','The Ten Commandments','Psalm 1','Leviticus 16'],a:0,w:'Mark 12:29-30 quotes Deuteronomy 6:4-5, then adds Leviticus 19:18.'},
 {t:'mc',l:3,q:'Deuteronomy 6:7 says these words should be taught how?',o:['Constantly, in ordinary daily settings at home and on the road','Only by priests','Once a year at festivals','Only in the temple'],a:0,w:'Sitting, walking, lying down and getting up — ordinary life, not a classroom.'}
]},
{id:'c_moses_death',b:'deu',e:'exodus',topic:'Death of Moses',d:2,claim:'text',ref:'Deuteronomy 34; Numbers 20',
 sum:'Moses sees the promised land from Mount Nebo but does not enter it, and dies in Moab; Joshua takes over.',
 p:[
 {t:'mc',l:2,q:'From which mountain does Moses view the promised land?',o:['Mount Nebo','Mount Sinai','Mount Carmel','Mount Hermon'],a:0,w:'Deuteronomy 34:1.'},
 {t:'cse',l:3,q:'Why is Moses not permitted to enter the land?',o:['Because of the incident at the waters of Meribah, where he struck the rock','He was too old','He refused to go','He stayed to lead Midian'],a:0,w:'Numbers 20:8-12 records the incident and God\u2019s response.'},
 {t:'con',l:5,q:'Where does Moses appear again in the New Testament?',o:['At the transfiguration, with Elijah','At the crucifixion','At Pentecost','In the upper room'],a:0,w:'Matthew 17:3 — Moses and Elijah appear with Jesus.'}
]},

/* ============================== CONQUEST ============================== */
{id:'c_jordan',b:'jos',e:'conquest',topic:'Crossing the Jordan',d:2,claim:'text',ref:'Joshua 3–4',
 sum:'The priests carrying the ark step into the flooded Jordan, the water stops, and Israel crosses on dry ground. Twelve stones are set up as a memorial.',
 p:[
 {t:'mc',l:1,q:'What had to happen before the Jordan\u2019s waters stopped?',o:['The priests carrying the ark stepped into the water','The army shouted','A trumpet was blown','Joshua struck the river'],a:0,w:'Joshua 3:15-16 — the water stops as their feet touch it.'},
 {t:'cse',l:3,q:'Why were twelve stones taken from the riverbed?',o:['As a memorial so children would ask what they meant','To build an altar for sacrifice','To mark the tribal borders','To weigh down the ark'],a:0,w:'Joshua 4:6-7 — memory as the stated purpose.'},
 {t:'con',l:4,q:'Which earlier event does the Jordan crossing deliberately echo?',o:['The crossing of the sea out of Egypt','The flood','The fall of Babel','The binding of Isaac'],a:0,w:'Joshua 4:23 makes the comparison explicitly — the same God, a new generation.'}
]},
{id:'c_jericho',b:'jos',e:'conquest',topic:'Jericho and Rahab',d:1,claim:'text',ref:'Joshua 2; 6',
 sum:'Rahab hides the Israelite spies and asks for her family to be spared; Israel marches round Jericho for seven days and the walls fall.',
 p:[
 {t:'mc',l:1,q:'How many days did Israel march around Jericho?',o:['Seven, with seven circuits on the last day','Three','Twelve','Forty'],a:0,w:'Joshua 6:3-4.'},
 {t:'who',l:2,clues:['I lived in Jericho','I hid two spies on my roof','I tied a scarlet cord in my window','Matthew\u2019s genealogy includes me'],o:['Rahab','Deborah','Jael','Ruth'],a:0,w:'Rahab — Joshua 2 and Matthew 1:5.'},
 {t:'cse',l:4,q:'What reason does Rahab give for helping the spies?',o:['She had heard what God did at the Red Sea and to the kings east of the Jordan','She was paid','She was related to Israel','She was forced'],a:0,w:'Joshua 2:9-11 — report of the exodus reached Jericho and produced faith in an outsider.'},
 {t:'con',l:5,q:'Rahab is named in three New Testament passages. Which best describes them?',o:['A genealogy of Jesus, a list of the faithful, and an example of faith shown by action','Three warnings against Canaan','Three parables','Three letters to churches'],a:0,w:'Matthew 1:5, Hebrews 11:31 and James 2:25.'}
]},
{id:'c_achan',b:'jos',e:'conquest',topic:'Achan and Ai',d:2,claim:'text',ref:'Joshua 7',
 sum:'Israel is defeated at Ai because Achan secretly kept devoted plunder from Jericho; the sin is uncovered and dealt with before Israel can advance.',
 p:[
 {t:'cse',l:3,q:'Why was Israel defeated at Ai?',o:['Achan had taken devoted things from Jericho','Their army was too small','Joshua was ill','The gates were too strong'],a:0,w:'Joshua 7:1, 11-12 makes the cause explicit.'},
 {t:'scn',l:4,q:'What does the Ai episode suggest about hidden wrongdoing in a community?',o:['One person\u2019s secret sin affected the whole nation\u2019s standing','Individual actions have no wider effect','Only leaders are accountable','Defeat is always random'],a:0,w:'The narrative treats Israel corporately — which is why the whole nation stalls until it is dealt with.'},
 {t:'nxt',l:3,q:'After the matter is resolved, what happens at Ai?',o:['Israel takes the city on a second attempt','Israel bypasses it','The city surrenders','Joshua returns to Gilgal permanently'],a:0,w:'Joshua 8 records the successful second attack.'}
]},
{id:'c_shechem',b:'jos',e:'conquest',topic:'Choose this day',d:2,claim:'text',ref:'Joshua 24',
 sum:'At Shechem, Joshua recounts Israel\u2019s history and calls the people to choose whom they will serve, declaring that he and his household will serve the LORD.',
 p:[
 {t:'mc',l:1,q:'Where does Joshua call Israel to choose whom they will serve?',o:['Shechem','Jericho','Bethel','Hebron'],a:0,w:'Joshua 24:1, 15.'},
 {t:'cse',l:4,q:'What does Joshua do before asking them to choose?',o:['Retells the whole story of what God has done for them','Counts the army','Divides the plunder','Appoints a king'],a:0,w:'Joshua 24:2-13 — memory first, then decision. The same pattern as Deuteronomy.'},
 {t:'con',l:4,q:'Which book\u2019s "blessing or curse" structure does Joshua 24 most closely follow?',o:['Deuteronomy','Leviticus','Ruth','Judges'],a:0,w:'Deuteronomy 30:19 sets out the same choose-life framing.'}
]},

/* =============================== JUDGES =============================== */
{id:'c_judges_cycle',b:'jdg',e:'judges',topic:'The judges cycle',d:2,claim:'text',ref:'Judges 2:11-19',
 sum:'Judges describes a repeating cycle: Israel abandons God, is oppressed by enemies, cries out, is rescued by a judge, then relapses when the judge dies.',
 p:[
 {t:'ord',l:3,q:'Put the stages of the judges cycle in order.',it:['Israel abandons the LORD','God allows enemies to oppress them','Israel cries out in distress','God raises up a judge to deliver them','There is peace while the judge lives','Israel relapses after the judge dies'],w:'Judges 2:11-19 sets out this pattern as the book\u2019s framework.'},
 {t:'fil',l:2,q:'The refrain near the end of Judges says everyone did what was right in their own ______.',o:['eyes','homes','time','way'],a:0,w:'Judges 17:6 and 21:25.'},
 {t:'con',l:4,q:'What does the repeated line "there was no king in Israel" set up?',o:['The move to monarchy in 1 Samuel','The exile','The building of the temple','The return from Babylon'],a:0,w:'Judges deliberately points forward to the question of kingship that 1 Samuel takes up.'}
]},
{id:'c_deborah',b:'jdg',e:'judges',topic:'Deborah',d:2,claim:'text',ref:'Judges 4–5',
 sum:'Deborah, a prophet and judge, summons Barak against Sisera\u2019s army; Barak insists she come with him, and Sisera is killed by Jael.',
 p:[
 {t:'who',l:2,clues:['I was a prophet and judged Israel','I held court under a palm tree','I summoned Barak to battle','I sang a victory song after Sisera fell'],o:['Deborah','Miriam','Huldah','Hannah'],a:0,w:'Deborah — Judges 4:4-5 and the song in Judges 5.'},
 {t:'cse',l:3,q:'Why did Barak\u2019s victory not bring him full honour?',o:['He insisted Deborah come with him, so the credit went to a woman','He arrived late','He refused to fight','He lost the battle'],a:0,w:'Judges 4:8-9 records Deborah\u2019s reply.'},
 {t:'mc',l:2,q:'Who actually kills Sisera?',o:['Jael','Barak','Deborah','Ehud'],a:0,w:'Judges 4:21.'}
]},
{id:'c_gideon',b:'jdg',e:'judges',topic:'Gideon',d:2,claim:'text',ref:'Judges 6–7',
 sum:'Gideon is called while threshing in a winepress, tests God with a fleece, and defeats Midian with three hundred men so that Israel cannot claim the credit.',
 p:[
 {t:'mc',l:1,q:'How many men did Gideon finally take into battle?',o:['Three hundred','Ten thousand','Twelve','Seven hundred'],a:0,w:'Judges 7:7.'},
 {t:'cse',l:3,q:'Why did God reduce Gideon\u2019s army?',o:['So Israel could not boast that its own strength had saved it','To save on supplies','Because most soldiers were injured','To match Midian\u2019s numbers'],a:0,w:'Judges 7:2 states the reason directly.'},
 {t:'nxt',l:3,q:'What was Gideon doing when the angel called him a mighty warrior?',o:['Threshing wheat in a winepress to hide it from Midian','Leading an army','Farming openly','Sitting at the city gate'],a:0,w:'Judges 6:11-12 — the greeting is almost ironic given the setting.'}
]},
{id:'c_samson',b:'jdg',e:'judges',topic:'Samson',d:2,claim:'text',ref:'Judges 13–16',
 sum:'Set apart as a Nazirite from birth, Samson fights the Philistines with extraordinary strength but is undone by his own choices and betrayed by Delilah.',
 p:[
 {t:'mc',l:1,q:'What finally leads to Samson\u2019s capture?',o:['Delilah learns the secret of his strength and his hair is cut','He is outnumbered in open battle','He surrenders willingly','He is betrayed by his father'],a:0,w:'Judges 16:17-21.'},
 {t:'cse',l:4,q:'What does Samson\u2019s story most clearly illustrate about the judges?',o:['God used deeply flawed deliverers, and Israel\u2019s condition kept deteriorating','Judges were morally exemplary','Israel needed no deliverer','Philistine rule ended permanently'],a:0,w:'Samson comes late in a book whose downward trajectory is deliberate.'},
 {t:'bok',l:2,q:'Which book tells Samson\u2019s story?',o:['Judges','1 Samuel','Joshua','Ruth'],a:0,w:'Judges 13–16.'}
]},
{id:'c_ruth',b:'rut',e:'judges',topic:'Ruth and Boaz',d:2,claim:'text',ref:'Ruth 1–4',
 sum:'A Moabite widow stays with her mother-in-law Naomi, gleans in Boaz\u2019s field, and through his role as kinsman-redeemer becomes the great-grandmother of David.',
 p:[
 {t:'mc',l:1,q:'Where was Ruth from?',o:['Moab','Egypt','Philistia','Edom'],a:0,w:'Ruth 1:4.'},
 {t:'con',l:4,q:'Why does Ruth\u2019s story matter for the rest of the Bible?',o:['She is David\u2019s great-grandmother and appears in Matthew\u2019s genealogy of Jesus','She founded a tribe','She wrote several psalms','She led an army'],a:0,w:'Ruth 4:17, 21-22 and Matthew 1:5.'},
 {t:'mc',l:3,q:'What role does Boaz take on for Ruth and Naomi?',o:['Kinsman-redeemer','Judge','Priest','King'],a:0,w:'Ruth 3:9 – 4:10. Many Christians read this role as a picture of Christ, which is an interpretation rather than a claim the book makes.'},
 {t:'scn',l:5,q:'Ruth is set "in the days when the judges ruled." How does its tone contrast with Judges?',o:['It shows quiet loyalty and kindness in the same period Judges portrays as chaotic','It is even more violent','It is set in Egypt','It repeats the judges cycle exactly'],a:0,w:'The contrast is one of the book\u2019s most striking features.'}
]},

/* =========================== UNITED KINGDOM =========================== */
{id:'c_samuel',b:'1sa',e:'united',topic:'Samuel',d:2,claim:'text',ref:'1 Samuel 1–3',
 sum:'Hannah prays for a son and dedicates Samuel to the LORD; as a boy at Shiloh he hears God call his name and becomes a trusted prophet.',
 p:[
 {t:'who',l:2,clues:['My mother had prayed for me and gave me to the LORD','I grew up serving at Shiloh under Eli','I heard my name called in the night','I later anointed two kings'],o:['Samuel','Samson','Saul','Solomon'],a:0,w:'Samuel — 1 Samuel 1–3, and later anoints Saul and David.'},
 {t:'mc',l:2,q:'Who did the boy Samuel first think was calling him?',o:['Eli','His mother','Saul','An angel'],a:0,w:'1 Samuel 3:5-8.'},
 {t:'con',l:4,q:'Hannah\u2019s song of praise is often compared to which New Testament song?',o:['Mary\u2019s Magnificat in Luke 1','The song of Moses','The song of the seraphim','Zechariah\u2019s prophecy'],a:0,w:'1 Samuel 2:1-10 and Luke 1:46-55 share striking themes of reversal. This comparison is a widely held reading rather than a stated link.'}
]},
{id:'c_king_request',b:'1sa',e:'united',topic:'Israel demands a king',d:2,claim:'text',ref:'1 Samuel 8',
 sum:'Israel asks Samuel for a king so they can be like the other nations; Samuel warns what a king will take from them, but they insist.',
 p:[
 {t:'cse',l:3,q:'What reason does Israel give for wanting a king?',o:['So they can be like all the other nations','So they can build a temple','So they can defeat Egypt','So Samuel can retire'],a:0,w:'1 Samuel 8:5, 19-20.'},
 {t:'mc',l:3,q:'What does Samuel warn a king will do?',o:['Take their sons, daughters, fields and a share of their produce','Abolish the priesthood','Move them to Egypt','Forbid farming'],a:0,w:'1 Samuel 8:11-18 lists the costs in detail.'},
 {t:'con',l:5,q:'How does the request in 1 Samuel 8 relate to the end of Judges?',o:['Judges repeatedly notes there was no king; 1 Samuel shows what happens when Israel gets one on their own terms','It contradicts Judges entirely','It is unrelated','It precedes Judges chronologically'],a:0,w:'The two books are deliberately linked by the kingship question.'}
]},
{id:'c_saul',b:'1sa',e:'united',topic:'Saul',d:2,claim:'text',ref:'1 Samuel 9–15',
 sum:'Saul is anointed Israel\u2019s first king and wins early victories, but offers an unlawful sacrifice and spares what he had been told to destroy, and is rejected as king.',
 p:[
 {t:'mc',l:1,q:'Who anointed Saul as Israel\u2019s first king?',o:['Samuel','Nathan','Eli','David'],a:0,w:'1 Samuel 10:1.'},
 {t:'cse',l:3,q:'What does Samuel tell Saul after he spares the best of the plunder?',o:['That obedience is better than sacrifice','That he should offer more sacrifices','That he should attack again','That he is forgiven'],a:0,w:'1 Samuel 15:22.'},
 {t:'ord',l:4,q:'Put Saul\u2019s reign in order.',it:['Anointed privately by Samuel','Confirmed as king before the people','Offers a sacrifice without waiting for Samuel','Spares what he was told to destroy','Rejected as king','Pursues David','Dies at Mount Gilboa'],w:'The turning point is disobedience, and everything after it is decline.'},
 {t:'scn',l:5,q:'Saul had height, victories and popular support. What does his story suggest the biblical writers value more?',o:['Obedience and the condition of the heart','Military strategy','Family lineage','Public approval'],a:0,w:'1 Samuel 16:7 states the principle directly as David is chosen.'}
]},
{id:'c_david_goliath',b:'1sa',e:'united',topic:'David and Goliath',d:1,claim:'text',ref:'1 Samuel 17',
 sum:'A young shepherd faces the Philistine champion with a sling and five stones, saying the battle belongs to the LORD.',
 p:[
 {t:'mc',l:1,q:'What weapon does David use against Goliath?',o:['A sling and a stone','A spear','A sword from the start','A bow'],a:0,w:'1 Samuel 17:49; he later uses Goliath\u2019s own sword.'},
 {t:'cse',l:3,q:'Why does David refuse Saul\u2019s armour?',o:['He was not used to it and had not tested it','It was too expensive','Saul forbade it','It was ceremonially unclean'],a:0,w:'1 Samuel 17:39.'},
 {t:'con',l:5,q:'What does the Goliath episode reveal about David before he becomes king?',o:['He already trusted God publicly and acted for Israel\u2019s sake, showing the kind of king he would be','That he wanted the throne immediately','That he was a trained soldier','That Saul had appointed him commander'],a:0,w:'The chapter functions as a character portrait ahead of his reign, not just an adventure story.'},
 {t:'scn',l:4,q:'What reason does David give for confidence in facing Goliath?',o:['God had delivered him from a lion and a bear','His size','Saul\u2019s promise of reward','A prophecy from Samuel'],a:0,w:'1 Samuel 17:34-37 — past experience of God\u2019s help.'}
]},
{id:'c_david_king',b:'2sa',e:'united',topic:'David becomes king',d:2,claim:'text',ref:'2 Samuel 2; 5',
 sum:'David reigns first over Judah at Hebron, then over all Israel, captures Jerusalem, and brings the ark there.',
 p:[
 {t:'mc',l:2,q:'Where did David first reign before ruling all Israel?',o:['Hebron','Bethlehem','Shiloh','Jericho'],a:0,w:'2 Samuel 2:1-4, seven and a half years.'},
 {t:'nxt',l:3,q:'After David captures Jerusalem, what does he bring there?',o:['The ark of the covenant','The bronze serpent','Solomon\u2019s throne','The tablets of Moses only'],a:0,w:'2 Samuel 6 — making the city a centre of worship as well as government.'},
 {t:'con',l:4,q:'Why is Jerusalem such a strategic choice for David\u2019s capital?',o:['It sat between the northern tribes and Judah and had not belonged to any tribe','It was the largest city in the region','It was near Egypt','It had the only temple'],a:0,w:'A neutral capital helped unite a recently divided nation — an inference from the narrative that historians widely make.'}
]},
{id:'c_dav_cov',b:'2sa',e:'united',topic:'The Davidic covenant',d:3,claim:'text',ref:'2 Samuel 7',
 sum:'David wants to build God a house; instead God promises to build David a house — a dynasty and a throne established for ever.',
 p:[
 {t:'cse',l:3,q:'What is the reversal at the heart of 2 Samuel 7?',o:['David offers to build God a house; God promises to build David a house','God refuses to speak to David','David refuses the throne','Nathan builds the temple'],a:0,w:'The wordplay on "house" (temple / dynasty) is the chapter\u2019s pivot.'},
 {t:'con',l:5,q:'Which New Testament title depends directly on the promise in 2 Samuel 7?',o:['Son of David','Lamb of God','Word made flesh','Good shepherd'],a:0,w:'"Son of David" runs from Matthew 1:1 through the Gospels and rests on this covenant.'},
 {t:'mc',l:2,q:'Who delivers God\u2019s message to David in 2 Samuel 7?',o:['Nathan the prophet','Samuel','Zadok','Gad'],a:0,w:'2 Samuel 7:4-17.'},
 {t:'exp',l:5,q:'Why does 2 Samuel 7 matter for understanding what people expected of a Messiah?',keys:['dynasty','throne','forever','Son of David','king','promise','Jerusalem'],
  model:'God promises David a lasting dynasty and a throne established for ever. That promise shapes later prophetic hope and the "Son of David" expectation in the Gospels — a coming king from David\u2019s line. It also explains why Jesus\u2019 genealogy and birthplace matter so much to Matthew and Luke, and why the crowds use royal language at the triumphal entry.'}
]},
{id:'c_bathsheba',b:'2sa',e:'united',topic:'David and Bathsheba',d:2,claim:'text',ref:'2 Samuel 11–12',
 sum:'David takes Bathsheba and arranges Uriah\u2019s death; Nathan confronts him with a parable, David confesses, and lasting consequences follow.',
 p:[
 {t:'mc',l:2,q:'How does Nathan confront David?',o:['With a parable about a rich man taking a poor man\u2019s lamb','With an army','By writing a letter','By refusing to speak to him'],a:0,w:'2 Samuel 12:1-7 — David condemns himself before he realises.'},
 {t:'cse',l:4,q:'What does 2 Samuel 11 note about where David was when this began?',o:['He stayed in Jerusalem at the time when kings went out to battle','He was on campaign','He was ill','He was in Hebron'],a:0,w:'2 Samuel 11:1 opens with that detail, setting the scene.'},
 {t:'con',l:4,q:'Which psalm is traditionally connected with David\u2019s repentance here?',o:['Psalm 51','Psalm 1','Psalm 100','Psalm 137'],a:0,w:'The superscription of Psalm 51 links it to Nathan\u2019s visit.'},
 {t:'scn',l:5,q:'David is called a man after God\u2019s own heart, yet this account is included in full. What does that suggest about the Bible\u2019s portrayal of its heroes?',o:['It records their serious failures rather than covering them up','It exaggerates their virtues','It ignores wrongdoing by kings','It excuses the powerful'],a:0,w:'The narrative neither hides the sin nor softens the consequences that follow in David\u2019s family.'}
]},
{id:'c_solomon',b:'1ki',e:'united',topic:'Solomon and the temple',d:2,claim:'text',ref:'1 Kings 3–11',
 sum:'Solomon asks for wisdom to govern, builds the temple in Jerusalem, becomes famous for wealth and wisdom, and later turns to other gods under the influence of foreign wives.',
 p:[
 {t:'mc',l:1,q:'What does Solomon ask God for when given the choice?',o:['A discerning heart to govern and tell right from wrong','Long life','Wealth','Victory over his enemies'],a:0,w:'1 Kings 3:9.'},
 {t:'nxt',l:3,q:'What is Solomon\u2019s greatest building project?',o:['The temple in Jerusalem','The walls of Jericho','A palace in Hebron','The second temple'],a:0,w:'1 Kings 6, taking seven years.'},
 {t:'cse',l:4,q:'What does 1 Kings 11 identify as the cause of Solomon\u2019s decline?',o:['His many foreign wives turned his heart to other gods','A military defeat','Famine','Rebellion by Judah'],a:0,w:'1 Kings 11:1-8.'},
 {t:'con',l:5,q:'How does Solomon\u2019s decline set up the next stage of Israel\u2019s story?',o:['God announces the kingdom will be torn away, and it divides under his son Rehoboam','It ends the monarchy immediately','It causes the exodus','It results in the exile within his lifetime'],a:0,w:'1 Kings 11:11-13 and 1 Kings 12 — cause and effect across a generation.'}
]},

/* =========================== DIVIDED KINGDOM =========================== */
{id:'c_division',b:'1ki',e:'divided',topic:'The kingdom divides',d:2,claim:'text',ref:'1 Kings 12',
 sum:'Rehoboam rejects advice to lighten the people\u2019s burden; ten northern tribes follow Jeroboam, leaving Judah in the south.',
 p:[
 {t:'cse',l:2,q:'What triggers the split of the kingdom?',o:['Rehoboam\u2019s harsh answer about lightening the people\u2019s load','A foreign invasion','A famine','Jeroboam\u2019s assassination of Solomon'],a:0,w:'1 Kings 12:12-16.'},
 {t:'mc',l:2,q:'After the division, which kingdom is in the north?',o:['Israel, under Jeroboam','Judah, under Rehoboam','Assyria','Edom'],a:0,w:'Ten tribes form Israel in the north; Judah remains in the south with Jerusalem.'},
 {t:'mat',l:4,q:'Match each kingdom to the correct details.',pr:[['Northern kingdom (Israel)','Capital eventually Samaria; fell to Assyria in 722 BC'],['Southern kingdom (Judah)','Capital Jerusalem; fell to Babylon in 586 BC']],w:'Keeping the two kingdoms and their two conquerors straight is essential for reading the prophets.'},
 {t:'ord',l:4,q:'Put these events in order.',it:['Solomon builds the temple','Solomon turns to other gods','Rehoboam refuses to lighten the burden','The kingdom divides','Samaria falls to Assyria','Jerusalem falls to Babylon'],w:'The chain from Solomon\u2019s compromise to two exiles is one of the Old Testament\u2019s clearest cause-and-effect lines.'}
]},
{id:'c_jeroboam',b:'1ki',e:'divided',topic:'Jeroboam\u2019s calves',d:3,claim:'text',ref:'1 Kings 12:25-33',
 sum:'To stop his people travelling to Jerusalem to worship, Jeroboam sets up golden calves at Bethel and Dan — a sin later kings are repeatedly measured against.',
 p:[
 {t:'cse',l:3,q:'Why does Jeroboam set up golden calves at Bethel and Dan?',o:['To keep his people from going to Jerusalem to worship','To honour Solomon','To trade with Egypt','To mark the borders'],a:0,w:'1 Kings 12:26-27 gives his political reasoning openly.'},
 {t:'con',l:5,q:'What earlier incident does the golden calf choice deliberately recall?',o:['Aaron\u2019s golden calf at Sinai','The bronze serpent','The ark\u2019s capture','The tower of Babel'],a:0,w:'The echo of Exodus 32 is unmistakable, and the wording is similar.'},
 {t:'mc',l:3,q:'How does 1–2 Kings usually describe later northern kings?',o:['As walking in the sins of Jeroboam','As righteous like David','As foreign rulers','As priests'],a:0,w:'The formula recurs throughout the northern kings\u2019 accounts.'}
]},
{id:'c_carmel',b:'1ki',e:'divided',topic:'Elijah on Mount Carmel',d:2,claim:'text',ref:'1 Kings 18',
 sum:'Elijah challenges the prophets of Baal to see whose God answers by fire; after their long failure, fire falls on Elijah\u2019s water-drenched altar.',
 p:[
 {t:'mc',l:1,q:'What does Elijah do to his altar before praying?',o:['Has it drenched with water','Covers it in oil','Sets it alight himself','Surrounds it with stones from Jericho'],a:0,w:'1 Kings 18:33-35 — removing any doubt about the source of the fire.'},
 {t:'cse',l:3,q:'What was the question Elijah put to the people on Carmel?',o:['How long they would waver between two opinions','Whether they wanted a king','Whether to return to Egypt','Whether to rebuild the temple'],a:0,w:'1 Kings 18:21.'},
 {t:'nxt',l:4,q:'What happens to Elijah shortly after this victory?',o:['He flees in fear from Jezebel and asks to die','He is crowned','He returns to Jericho','He anoints Solomon'],a:0,w:'1 Kings 19:1-4 — the collapse right after the triumph is part of the point.'}
]},
{id:'c_whisper',b:'1ki',e:'divided',topic:'The low whisper at Horeb',d:3,claim:'text',ref:'1 Kings 19',
 sum:'Exhausted and afraid, Elijah is fed and allowed to sleep, then hears God not in wind, earthquake or fire, but in a low whisper.',
 p:[
 {t:'mc',l:2,q:'How does God speak to Elijah at Horeb?',o:['In a low whisper after wind, earthquake and fire','In thunder','Through a burning bush','Through Jezebel'],a:0,w:'1 Kings 19:11-13.'},
 {t:'cse',l:4,q:'What does God do for Elijah before addressing his complaint?',o:['Lets him sleep and gives him food twice','Rebukes him immediately','Sends him back to Carmel','Removes his office'],a:0,w:'1 Kings 19:5-8 — physical care comes first, which readers often note.'},
 {t:'scn',l:5,q:'What does 1 Kings 19 suggest about spiritual burnout?',o:['Even a prophet after a great victory can collapse, and God\u2019s response includes rest, food and a renewed task','That burnout indicates disqualification','That God speaks only through dramatic events','That Elijah\u2019s ministry ended there'],a:0,w:'Elijah is given rest, then a fresh assignment and a successor.'}
]},
{id:'c_naaman',b:'2ki',e:'divided',topic:'Elisha and Naaman',d:2,claim:'text',ref:'2 Kings 5',
 sum:'Naaman, a Syrian commander with a skin disease, is told by Elisha to wash seven times in the Jordan; he is offended by the simplicity, then obeys and is healed.',
 p:[
 {t:'mc',l:2,q:'What was Naaman told to do to be healed?',o:['Wash seven times in the Jordan','Offer a sacrifice at Samaria','Travel to Jerusalem','Fast for a week'],a:0,w:'2 Kings 5:10.'},
 {t:'cse',l:3,q:'Why was Naaman initially angry?',o:['He expected a dramatic ritual, not a simple instruction to wash in an ordinary river','He was refused an audience','The price was too high','He was told to leave Israel'],a:0,w:'2 Kings 5:11-12.'},
 {t:'con',l:5,q:'Jesus refers to Naaman in his Nazareth sermon. What point is he making?',o:['That God\u2019s mercy reached outsiders, which angered his hometown listeners','That healing requires payment','That prophets should stay home','That Syria would be judged'],a:0,w:'Luke 4:27 — the reference contributes to the crowd\u2019s fury.'}
]},
{id:'c_samaria_fall',b:'2ki',e:'divided',topic:'Fall of Samaria',d:2,claim:'text',ref:'2 Kings 17',
 sum:'In 722 BC Assyria conquers the northern kingdom and deports its people; 2 Kings gives a long explanation of why it happened.',
 p:[
 {t:'mc',l:1,q:'Which empire conquered the northern kingdom of Israel in 722 BC?',o:['Assyria','Babylon','Persia','Egypt'],a:0,w:'2 Kings 17:6.'},
 {t:'cse',l:3,q:'What reason does 2 Kings 17 give for the fall of Israel?',o:['Persistent covenant unfaithfulness despite repeated prophetic warning','Poor harvests','Weak city walls','A dispute with Judah'],a:0,w:'2 Kings 17:7-23 gives an unusually long theological explanation.'},
 {t:'mat',l:4,q:'Match each kingdom\u2019s fall to its conqueror and date.',pr:[['Israel (north), 722 BC','Assyria'],['Judah (south), 586 BC','Babylon']],w:'Two kingdoms, two empires, two dates — the single most useful fact-pair in Old Testament history.'}
]},
{id:'c_josiah',b:'2ki',e:'divided',topic:'Josiah and the scroll',d:2,claim:'text',ref:'2 Kings 22–23',
 sum:'During temple repairs the book of the law is found; Josiah tears his clothes when it is read and launches sweeping reform.',
 p:[
 {t:'mc',l:2,q:'What is found during the temple repairs under Josiah?',o:['The book of the law','The ark','Solomon\u2019s crown','The bronze serpent'],a:0,w:'2 Kings 22:8.'},
 {t:'cse',l:3,q:'What is Josiah\u2019s reaction when the book is read to him?',o:['He tears his clothes and orders the LORD to be sought','He ignores it','He hides it','He has it copied and stored'],a:0,w:'2 Kings 22:11-13.'},
 {t:'scn',l:5,q:'What does the Josiah account suggest about the state of the nation before the discovery?',o:['Scripture had been so neglected that its contents came as a shock even to the king','That the law was newly written','That reform had already succeeded','That priests were teaching it faithfully'],a:0,w:'The shock at hearing it is the narrative\u2019s point.'}
]},

/* ================================ EXILE ================================ */
{id:'c_exile_fall',b:'2ki',e:'exile',topic:'Fall of Jerusalem',d:1,claim:'text',ref:'2 Kings 25',
 sum:'In 586 BC Babylon breaks through Jerusalem\u2019s walls, burns the temple and the city, and deports the people of Judah.',
 p:[
 {t:'mc',l:1,q:'Which empire destroyed Jerusalem and the temple in 586 BC?',o:['Babylon','Assyria','Persia','Rome'],a:0,w:'2 Kings 25:8-10, under Nebuchadnezzar.'},
 {t:'nxt',l:3,q:'What happens to the people of Judah after Jerusalem falls?',o:['Most are deported to Babylon','They flee to Assyria','They rebuild immediately','They are absorbed into Egypt'],a:0,w:'2 Kings 25:11 — the exile begins.'},
 {t:'bok',l:3,q:'Which book is a set of poems grieving this destruction?',o:['Lamentations','Ecclesiastes','Proverbs','Esther'],a:0,w:'Lamentations\u2019 five poems respond directly to the fall of Jerusalem.'},
 {t:'con',l:5,q:'Which prophets\u2019 messages are best understood against this event?',o:['Jeremiah before it, Ezekiel and Daniel during the exile','Joshua and Judges','Haggai and Malachi before it','Ruth and Esther'],a:0,w:'Jeremiah warned in Jerusalem; Ezekiel and Daniel ministered among the exiles.'}
]},
{id:'c_daniel_court',b:'dan',e:'exile',topic:'Daniel in Babylon',d:2,claim:'text',ref:'Daniel 1; 3; 6',
 sum:'Daniel and his friends serve in the Babylonian court without compromising: refusing the king\u2019s food, refusing to bow to a statue, and continuing to pray when it is outlawed.',
 p:[
 {t:'mc',l:1,q:'What do Daniel and his friends refuse in Daniel 1?',o:['The king\u2019s food and wine','Their Babylonian names','To learn the language','To serve in the court'],a:0,w:'Daniel 1:8 — notably, they accept the names and the training.'},
 {t:'who',l:2,clues:['I was taken to Babylon as a young man','I interpreted a king\u2019s troubling dream','I kept praying with my windows open toward Jerusalem','I spent a night with lions'],o:['Daniel','Ezekiel','Nehemiah','Mordecai'],a:0,w:'Daniel — Daniel 2, 6.'},
 {t:'cse',l:4,q:'Why is Daniel thrown into the lions\u2019 den?',o:['He kept praying openly after a law forbade praying to anyone but the king','He refused to work','He insulted Darius','He led a rebellion'],a:0,w:'Daniel 6:7-13 — the law was designed to trap him.'},
 {t:'scn',l:5,q:'Daniel serves a pagan empire faithfully while refusing specific things. What model does that offer?',o:['Full engagement with a society combined with clear limits where loyalty to God is at stake','Total withdrawal from public life','Complete assimilation','Armed resistance'],a:0,w:'The book repeatedly shows competence in office alongside firm boundaries.'}
]},
{id:'c_dry_bones',b:'eze',e:'exile',topic:'Valley of dry bones',d:2,claim:'text',ref:'Ezekiel 37',
 sum:'Ezekiel sees a valley of dry bones come together, take on flesh, and live again — a picture of exiled Israel being restored.',
 p:[
 {t:'mc',l:2,q:'What does the vision of dry bones represent, according to Ezekiel 37:11?',o:['The whole house of Israel, who said their hope was gone','The nations','The temple','The prophets'],a:0,w:'Ezekiel gives the interpretation within the chapter.'},
 {t:'cse',l:3,q:'What brings the bones to life in the vision?',o:['God\u2019s breath or spirit entering them','Rain','Ezekiel\u2019s hands','A sacrifice'],a:0,w:'Ezekiel 37:9-10.'},
 {t:'con',l:5,q:'Which other exile-era promise does Ezekiel 37 sit alongside?',o:['Ezekiel 36\u2019s new heart and new spirit, and Jeremiah 31\u2019s new covenant','The Sinai covenant','The rainbow covenant','The Jubilee laws'],a:0,w:'All three describe an internal renewal beyond mere political restoration.'}
]},
{id:'c_lam_hope',b:'lam',e:'exile',topic:'Mercies new every morning',d:2,claim:'text',ref:'Lamentations 3:22-23',
 sum:'In the middle of five poems of grief, the poet states that God\u2019s steadfast love never ends and his mercies are new every morning.',
 p:[
 {t:'mc',l:2,q:'Where in Lamentations does the statement of hope appear?',o:['In the middle, at the centre of the book','In the first verse','Only at the very end','It does not appear'],a:0,w:'Lamentations 3:22-23 sits at the structural centre of the five poems.'},
 {t:'scn',l:5,q:'What does it mean that Lamentations includes both raw grief and this hope, without resolving one into the other?',o:['Lament and hope can be held together honestly; grief is not treated as a lack of faith','Grief should be avoided','Hope cancels the grief','The book contradicts itself'],a:0,w:'The book ends unresolved, which many readers find is precisely what makes it useful.'},
 {t:'bok',l:2,q:'Which book is traditionally associated with Jeremiah and mourns Jerusalem\u2019s fall?',o:['Lamentations','Nahum','Habakkuk','Joel'],a:0,w:'Lamentations. The link to Jeremiah is traditional; the book does not name its author.'}
]},

/* =============================== RETURN =============================== */
{id:'c_cyrus',b:'ezr',e:'return',topic:'The decree of Cyrus',d:2,claim:'text',ref:'Ezra 1:1-4',
 sum:'In 538 BC Cyrus of Persia decrees that the exiles may return to Jerusalem and rebuild the temple.',
 p:[
 {t:'mc',l:1,q:'Which Persian king decreed that the exiles could return?',o:['Cyrus','Nebuchadnezzar','Darius the Mede','Artaxerxes'],a:0,w:'Ezra 1:1-4; the same decree closes 2 Chronicles.'},
 {t:'con',l:4,q:'Which two books end and begin with the same decree of Cyrus?',o:['2 Chronicles and Ezra','2 Kings and Ezra','Daniel and Nehemiah','Esther and Ezra'],a:0,w:'2 Chronicles 36:22-23 and Ezra 1:1-3 overlap almost word for word.'},
 {t:'ord',l:4,q:'Put the return-era events in order.',it:['Jerusalem falls to Babylon','Exile in Babylon','Cyrus decrees the return','Temple rebuilt and completed','Ezra returns and teaches the law','Nehemiah rebuilds the walls'],w:'Temple first, then teaching, then walls — a useful sequence for the whole return period.'}
]},
{id:'c_temple2',b:'ezr',e:'return',topic:'The second temple',d:2,claim:'text',ref:'Ezra 3–6; Haggai 1',
 sum:'The foundation is laid amid mixed weeping and shouting; opposition halts the work for years until Haggai and Zechariah stir the people to finish it in 516 BC.',
 p:[
 {t:'cse',l:3,q:'Why did work on the second temple stop for years?',o:['Opposition from surrounding peoples and official interference','A plague','Lack of stone','Cyrus revoked the decree'],a:0,w:'Ezra 4 records the opposition and the halt.'},
 {t:'mc',l:3,q:'Which two prophets urged the people to resume building?',o:['Haggai and Zechariah','Amos and Hosea','Isaiah and Micah','Joel and Obadiah'],a:0,w:'Ezra 5:1-2; both books are addressed to exactly this situation.'},
 {t:'cse',l:4,q:'Why did some older people weep when the foundation was laid?',o:['They remembered the first temple and this one seemed smaller','They opposed the project','They had lost family in the journey','The stone was of poor quality'],a:0,w:'Ezra 3:12 — weeping and shouting at the same moment.'}
]},
{id:'c_nehemiah',b:'neh',e:'return',topic:'Nehemiah rebuilds the walls',d:2,claim:'text',ref:'Nehemiah 1–6',
 sum:'Nehemiah hears that Jerusalem\u2019s walls are broken, prays, asks the Persian king for permission, and rebuilds the walls in fifty-two days despite opposition.',
 p:[
 {t:'mc',l:1,q:'How long did the wall rebuilding take?',o:['Fifty-two days','Seven years','Six months','Forty days'],a:0,w:'Nehemiah 6:15.'},
 {t:'cse',l:3,q:'What does Nehemiah do first when he hears the news about Jerusalem?',o:['He weeps, fasts and prays for days before acting','He immediately sets out','He writes to Ezra','He resigns his post'],a:0,w:'Nehemiah 1:4 — prayer precedes the plan.'},
 {t:'scn',l:4,q:'Sanballat and Tobiah try ridicule, threats and invitations to meet. How does Nehemiah respond?',o:['He posts guards, keeps building, and refuses to come down from the work','He negotiates a pause','He appeals to Babylon','He abandons the project'],a:0,w:'Nehemiah 4 and 6:3 — the famous reply about doing a great work.'}
]},
{id:'c_esther',b:'est',e:'return',topic:'Esther',d:2,claim:'text',ref:'Esther 4',
 sum:'Esther, a Jewish queen of Persia, risks her life by approaching the king uninvited to expose Haman\u2019s plot against her people.',
 p:[
 {t:'mc',l:1,q:'What risk does Esther take in chapter 4?',o:['Approaching the king without being summoned','Leaving the palace','Refusing to marry','Travelling to Jerusalem'],a:0,w:'Esther 4:11, 16 — an unsummoned approach could mean death.'},
 {t:'fil',l:2,q:'Mordecai suggests Esther may have come to her position for such a time as ______.',o:['this','then','before','coming'],a:0,w:'Esther 4:14.'},
 {t:'con',l:5,q:'God is never named in the Hebrew text of Esther. How is this best described?',o:['A striking feature many read as showing hidden providence — an interpretation, not a statement of the book','A copying error','Evidence the book is not about God','A translation issue'],a:0,w:'The absence is real and deliberate-looking; what it means is an interpretive judgment.'}
]},

/* ========================= WISDOM & POETRY ========================= */
{id:'c_job',b:'job',e:'wisdom',topic:'Job and suffering',d:3,claim:'text',ref:'Job 1–2; 38–42',
 sum:'Job loses everything, his friends insist he must have sinned, and God finally answers not with an explanation but with questions about creation.',
 p:[
 {t:'mc',l:2,q:'What is the core argument of Job\u2019s three friends?',o:['That his suffering must be punishment for hidden sin','That God does not exist','That he should move away','That he should sacrifice more animals'],a:0,w:'Their speeches assume a strict link between sin and suffering.'},
 {t:'cse',l:4,q:'When God finally speaks, what does he give Job?',o:['A series of questions about creation rather than an explanation of his suffering','A detailed reason for his losses','A rebuke of Job\u2019s children','A new law'],a:0,w:'Job 38–41 — the reader knows the prologue, but Job never gets that explanation.'},
 {t:'scn',l:5,q:'A friend suffering a serious illness is told it must be because of unconfessed sin. What does Job offer here?',o:['God explicitly says the friends spoke wrongly about him, undercutting that logic','It confirms the friends\u2019 view','It says suffering is always meaningless','It forbids asking questions'],a:0,w:'Job 42:7 is the book\u2019s verdict on the friends\u2019 theology.'},
 {t:'con',l:4,q:'Which New Testament verse points back to Job as an example?',o:['James 5:11','Romans 12:1','John 3:16','Acts 2:38'],a:0,w:'James 5:11 mentions Job\u2019s perseverance and the Lord\u2019s compassion.'}
]},
{id:'c_psalms',b:'psa',e:'wisdom',topic:'The Psalms',d:2,claim:'text',ref:'Psalms',
 sum:'A collection of 150 songs and prayers in five books, covering praise, lament, thanksgiving, confession and royal hope.',
 p:[
 {t:'mc',l:1,q:'How many psalms are in the book of Psalms?',o:['150','120','66','100'],a:0,w:'150, arranged in five books.'},
 {t:'mc',l:3,q:'Which type of psalm is the most common in the collection?',o:['Lament','Wedding song','Genealogy','Legal ruling'],a:0,w:'Laments outnumber every other category — a striking fact about Israel\u2019s prayer book.'},
 {t:'con',l:5,q:'Which psalm does Jesus quote from the cross?',o:['Psalm 22','Psalm 119','Psalm 150','Psalm 23'],a:0,w:'Matthew 27:46 quotes the opening line of Psalm 22.'},
 {t:'scn',l:5,q:'Someone says it is wrong to bring anger or despair to God in prayer. What do the Psalms show?',o:['Israel\u2019s own prayer book is full of complaint and protest addressed directly to God','That only praise is acceptable','That laments were later additions','That prayer should be silent'],a:0,w:'Psalms such as 13, 22, 42 and 88 model exactly this kind of honesty.'}
]},
{id:'c_proverbs',b:'pro',e:'wisdom',topic:'The fear of the LORD',d:2,claim:'text',ref:'Proverbs 1:7; 9:10',
 sum:'Proverbs states that the fear of the LORD is the beginning of knowledge and wisdom — reverence is the starting point, not the conclusion.',
 p:[
 {t:'fil',l:1,q:'Proverbs 1:7 says the fear of the LORD is the beginning of ______.',o:['knowledge','wealth','strength','peace'],a:0,w:'Proverbs 1:7; 9:10 says the same of wisdom.'},
 {t:'mc',l:3,q:'What kind of literature is Proverbs mostly made of?',o:['Short general sayings about how life usually works','Absolute promises with no exceptions','Historical narrative','Legal statutes'],a:0,w:'Proverbs states general patterns; Job and Ecclesiastes deliberately test the exceptions.'},
 {t:'con',l:5,q:'Which New Testament letter is often described as wisdom literature in the Proverbs tradition?',o:['James','Romans','Hebrews','Philemon'],a:0,w:'James shares Proverbs\u2019 style: short practical sayings about speech, money and behaviour.'}
]},
{id:'c_ecclesiastes',b:'ecc',e:'wisdom',topic:'Ecclesiastes',d:3,claim:'text',ref:'Ecclesiastes 1; 3; 12',
 sum:'The Teacher tests pleasure, work and wisdom, finds all of it fleeting, and ends by advising his readers to enjoy ordinary gifts and fear God.',
 p:[
 {t:'mc',l:2,q:'What is the Teacher\u2019s repeated verdict on his experiments with pleasure, work and wisdom?',o:['They are fleeting, like vapour or breath','They are entirely worthless','They guarantee happiness','They are forbidden'],a:0,w:'The Hebrew word behind "vanity" suggests vapour or breath — fleeting rather than pointless.'},
 {t:'mc',l:3,q:'How does Ecclesiastes end?',o:['With a charge to fear God and keep his commandments','With despair','With a list of laws','With a genealogy'],a:0,w:'Ecclesiastes 12:13.'},
 {t:'con',l:5,q:'How do Proverbs, Job and Ecclesiastes function together?',o:['Proverbs gives the usual patterns; Job and Ecclesiastes press the cases where those patterns fail','They contradict each other irreconcilably','They repeat the same material','They are all narrative history'],a:0,w:'Reading them as a conversation is a common and fruitful approach to the wisdom books.'}
]},
{id:'c_song',b:'sng',e:'wisdom',topic:'Song of Songs',d:3,claim:'debated',ref:'Song of Songs',
 sum:'Love poetry between a bride and her beloved. Christians have read it both as a celebration of married love and as an allegory of God\u2019s love for his people.',
 p:[
 {t:'mc',l:2,q:'What kind of book is Song of Songs?',o:['Love poetry','Legal code','Genealogy','Apocalyptic vision'],a:0,w:'It is a collection of love poems.'},
 {t:'con',l:5,q:'How should the allegorical reading of Song of Songs be described?',o:['A long-standing interpretation that Christians hold to varying degrees, not a claim the book itself makes','The only valid reading','A modern invention with no history','Explicitly stated in chapter 1'],a:0,w:'Both the plain-sense and allegorical readings have long histories; the book does not settle the question.'},
 {t:'bok',l:3,q:'Song of Songs sits among the wisdom and poetry books. Which set does it belong to?',o:['Job, Psalms, Proverbs, Ecclesiastes, Song of Songs','Joshua, Judges, Ruth, 1–2 Samuel','Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel','Matthew, Mark, Luke, John'],a:0,w:'The five wisdom and poetry books sit between the historical books and the prophets in English Bibles.'}
]},

/* ============================ MAJOR PROPHETS ============================ */
{id:'c_isaiah_call',b:'isa',e:'majorprophets',topic:'Isaiah\u2019s call',d:2,claim:'text',ref:'Isaiah 6',
 sum:'Isaiah sees the LORD in the temple, is undone by his own uncleanness, is cleansed with a coal from the altar, and volunteers to be sent.',
 p:[
 {t:'mc',l:1,q:'What is Isaiah\u2019s first reaction to seeing the LORD in the temple?',o:['He says he is ruined, a man of unclean lips','He volunteers immediately','He falls asleep','He asks for a sign'],a:0,w:'Isaiah 6:5 — awareness of his own condition comes before the commission.'},
 {t:'ord',l:3,q:'Put Isaiah 6 in order.',it:['Isaiah sees the LORD, high and lifted up','He confesses his unclean lips','A seraph touches his lips with a coal from the altar','God asks whom he shall send','Isaiah answers, "Here am I; send me"','He is told the message will not be well received'],w:'The last stage matters: the commission comes with a warning about the response.'},
 {t:'cse',l:4,q:'What is Isaiah told about how his message will be received?',o:['That people will hear but not understand','That the nation will repent at once','That he will be made king','That he will never speak publicly'],a:0,w:'Isaiah 6:9-10, quoted several times in the New Testament.'}
]},
{id:'c_servant',b:'isa',e:'majorprophets',topic:'The suffering servant',d:3,claim:'text',ref:'Isaiah 52:13 – 53:12',
 sum:'Isaiah describes a servant who is despised, who bears the sins of many, and who is vindicated after suffering on their behalf.',
 p:[
 {t:'mc',l:2,q:'How does Isaiah 53 describe the servant\u2019s suffering?',o:['He is wounded for the transgressions of others','He suffers for his own sins','He escapes suffering','He suffers unnoticed by anyone'],a:0,w:'Isaiah 53:5-6.'},
 {t:'con',l:5,q:'Where in Acts is Isaiah 53 explicitly applied to Jesus?',o:['Acts 8, when Philip meets the Ethiopian official','Acts 2, at Pentecost','Acts 15, at the council','Acts 27, on the ship'],a:0,w:'Acts 8:32-35 — the official is reading Isaiah 53 when Philip explains it.'},
 {t:'bok',l:3,q:'Which prophetic book contains the Servant Songs?',o:['Isaiah','Jeremiah','Ezekiel','Hosea'],a:0,w:'Isaiah, in chapters 42, 49, 50 and 52–53.'}
]},
{id:'c_isa_trust',b:'isa',e:'majorprophets',topic:'Trust God, not empires',d:3,claim:'text',ref:'Isaiah 7; 36–37',
 sum:'Isaiah repeatedly tells Judah\u2019s kings to trust God rather than bargain with great powers. Ahaz refuses a sign and turns to Assyria; Hezekiah later spreads the enemy\u2019s letter before God and Jerusalem is spared.',
 p:[
 {t:'cse',l:3,q:'What does Isaiah urge Ahaz to do when threatened by an alliance of neighbouring kings?',o:['Stand firm in faith rather than seek a foreign alliance','Surrender the city','Attack first','Move the capital'],a:0,w:'Isaiah 7:4-9; Ahaz turns to Assyria instead.'},
 {t:'mc',l:2,q:'What does Hezekiah do when Sennacherib\u2019s threatening letter arrives?',o:['Takes it into the temple and spreads it before the LORD','Burns it','Sends tribute at once','Ignores it'],a:0,w:'2 Kings 19:14; Isaiah 37:14.'},
 {t:'mat',l:4,q:'Match each king to how he responded to a national crisis.',pr:[['Ahaz','Refused a sign and sought help from Assyria'],['Hezekiah','Prayed in the temple and was told Jerusalem would be spared'],['Josiah','Reformed the nation after the book of the law was found'],['Rehoboam','Answered the people harshly and split the kingdom']],w:'The books of Kings and Isaiah judge rulers largely by where they placed their trust.'},
 {t:'con',l:5,q:'What sign is given to Ahaz in Isaiah 7:14, and how is it used later?',o:['A child called Immanuel — quoted in Matthew 1 about Jesus\u2019 birth','A pillar of cloud, quoted in Acts','A rainbow, quoted in Hebrews','A star, quoted in Revelation'],a:0,w:'Matthew 1:22-23 applies the verse to Jesus. How the sign functioned in Ahaz\u2019s own day is discussed differently by different Christian readers.'}
]},
{id:'c_jer_call',b:'jer',e:'majorprophets',topic:'Jeremiah\u2019s call and cost',d:3,claim:'text',ref:'Jeremiah 1; 7; 36; 38',
 sum:'Jeremiah is called while young and told he will be opposed by everyone. He preaches in the temple courts, has his scroll burned by the king, and is thrown into a cistern — and keeps going.',
 p:[
 {t:'cse',l:3,q:'What is Jeremiah\u2019s objection when he is called?',o:['That he is too young and does not know how to speak','That he lives too far away','That he is a foreigner','That he is a priest already'],a:0,w:'Jeremiah 1:6.'},
 {t:'mc',l:2,q:'What does King Jehoiakim do with the scroll of Jeremiah\u2019s words?',o:['Cuts it up and burns it a piece at a time','Stores it in the temple','Reads it publicly','Sends it to Babylon'],a:0,w:'Jeremiah 36:23; a second scroll is then written.'},
 {t:'ord',l:4,q:'Put Jeremiah\u2019s ministry in order.',it:['Called as a young man','Preaches in the temple courts against false confidence','His scroll is burned by the king','He is imprisoned and thrown into a cistern','Jerusalem falls to Babylon','He promises a new covenant'],w:'Jeremiah\u2019s ministry spans roughly forty years and ends around the fall of the city.'},
 {t:'scn',l:5,q:'Jeremiah preached for decades with almost no visible response. What does his book suggest faithfulness is measured by?',o:['Obedience to what God said, rather than visible results','The size of the crowd','Political influence','The number of converts'],a:0,w:'The book presents an unpopular prophet who was proved right, which shapes how later writers speak about faithfulness under pressure.'}
]},
{id:'c_new_covenant',b:'jer',e:'majorprophets',topic:'The new covenant',d:3,claim:'text',ref:'Jeremiah 31:31-34',
 sum:'Jeremiah promises a new covenant in which God writes his law on hearts, is their God, and forgives their sin.',
 p:[
 {t:'mc',l:2,q:'What is distinctive about the new covenant Jeremiah describes?',o:['God writes his law on their hearts rather than on stone','It applies only to priests','It requires a new temple','It removes the need for forgiveness'],a:0,w:'Jeremiah 31:33.'},
 {t:'con',l:5,q:'Which New Testament book quotes Jeremiah 31 at length?',o:['Hebrews','Jude','Titus','2 John'],a:0,w:'Hebrews 8:8-12 quotes the passage in full to argue for a better covenant.'},
 {t:'mat',l:4,q:'Match each exile-era promise to its book.',pr:[['The law written on hearts','Jeremiah'],['A new heart and a new spirit','Ezekiel'],['Mercies new every morning','Lamentations'],['Visions of kingdoms that rise and fall','Daniel']],w:'Four exile-era books, four distinct contributions.'}
]},
{id:'c_son_of_man',b:'dan',e:'majorprophets',topic:'Daniel\u2019s son of man',d:3,claim:'text',ref:'Daniel 7',
 sum:'Daniel sees four beasts and then one like a son of man coming with the clouds, given authority and a kingdom that will not pass away.',
 p:[
 {t:'mc',l:2,q:'In Daniel 7, what is given to the one like a son of man?',o:['Authority, glory and an everlasting kingdom','A sword','A temple','A scroll of laws'],a:0,w:'Daniel 7:13-14.'},
 {t:'con',l:5,q:'Why does it matter that Jesus repeatedly calls himself "the Son of Man"?',o:['The phrase carries Daniel 7\u2019s picture of a figure given everlasting authority','It simply means "an ordinary person" with no further significance','It was a common royal title in Rome','It refers to Adam only'],a:0,w:'Jesus\u2019 use of the title draws on Daniel 7, which is why it appears at his trial (Mark 14:62).'},
 {t:'mc',l:3,q:'How should the detailed interpretation of Daniel\u2019s beasts be treated?',o:['As genuinely debated among Christians','As settled and uncontroversial','As irrelevant to the book','As identical to Revelation\u2019s'],a:0,w:'Careful Christians hold different frameworks for identifying the kingdoms.'}
]},

/* ============================ MINOR PROPHETS ============================ */
{id:'c_hosea',b:'hos',e:'minorprophets',topic:'Hosea',d:2,claim:'text',ref:'Hosea 1–3; 6:6',
 sum:'Hosea\u2019s marriage to an unfaithful wife becomes a living picture of Israel\u2019s unfaithfulness and God\u2019s persistent love.',
 p:[
 {t:'mc',l:2,q:'What does Hosea\u2019s marriage illustrate?',o:['Israel\u2019s unfaithfulness and God\u2019s persistent love','The value of arranged marriage','The fall of Assyria','The rebuilding of the temple'],a:0,w:'Hosea 1:2 states the purpose directly.'},
 {t:'con',l:5,q:'Jesus twice quotes Hosea 6:6. What does that verse say God desires?',o:['Mercy rather than sacrifice','More sacrifices','A new temple','Silence'],a:0,w:'Matthew 9:13 and 12:7 both quote it in disputes about how to treat people.'},
 {t:'who',l:3,clues:['I was a prophet to the northern kingdom','My family life became my message','My children were given symbolic names','Jesus quoted my line about mercy rather than sacrifice'],o:['Hosea','Amos','Micah','Joel'],a:0,w:'Hosea.'}
]},
{id:'c_amos',b:'amo',e:'minorprophets',topic:'Amos and justice',d:2,claim:'text',ref:'Amos 5',
 sum:'Amos, a shepherd from Judah, confronts prosperous Israel: God rejects their festivals while they trample the poor, and calls for justice to roll on like a river.',
 p:[
 {t:'mc',l:2,q:'What is Amos\u2019s central charge against Israel?',o:['Injustice toward the poor alongside enthusiastic worship','Failure to build a temple','Poor military preparation','Neglect of genealogies'],a:0,w:'Amos 5:11-24.'},
 {t:'cse',l:4,q:'Why does God say he hates their festivals in Amos 5?',o:['Because worship without justice is unacceptable to him','Because festivals were forbidden','Because the wrong priests led them','Because they were held too often'],a:0,w:'The rejection is about the mismatch between worship and conduct.'},
 {t:'con',l:4,q:'Which other prophet makes a similar point in a famous one-line summary?',o:['Micah 6:8 — do justice, love mercy, walk humbly','Nahum 1:1','Obadiah 1:1','Haggai 2:9'],a:0,w:'Micah 6:8 condenses the same priorities.'}
]},
{id:'c_jonah',b:'jon',e:'minorprophets',topic:'Jonah',d:1,claim:'text',ref:'Jonah 1–4',
 sum:'Jonah flees rather than warn Nineveh, is swallowed by a great fish, finally preaches, and is angry when the city repents and is spared.',
 p:[
 {t:'cse',l:3,q:'Why is Jonah angry at the end of the book?',o:['Because God spared Nineveh when they repented','Because the fish released him','Because his message was ignored','Because he lost his ship'],a:0,w:'Jonah 4:1-2 — he says this is exactly why he ran in the first place.'},
 {t:'mc',l:1,q:'Where was Jonah told to go?',o:['Nineveh','Tarshish','Babylon','Jerusalem'],a:0,w:'Jonah 1:2; Tarshish was the direction he fled.'},
 {t:'con',l:5,q:'What does Jesus mean by "the sign of Jonah"?',o:['A comparison to time in the fish and his own death and resurrection','A prediction about Nineveh','A call to travel by sea','A warning against prophets'],a:0,w:'Matthew 12:39-41.'},
 {t:'scn',l:5,q:'What makes Jonah unusual among the prophetic books?',o:['The prophet, not the audience, is the one whose heart is in question','It contains no prophecy','It is written in Greek','It has no ending'],a:0,w:'Nineveh repents almost immediately; the book\u2019s real problem is Jonah.'}
]},
{id:'c_micah68',b:'mic',e:'minorprophets',topic:'What the LORD requires',d:2,claim:'text',ref:'Micah 6:8; 5:2',
 sum:'Micah summarises what God requires as doing justice, loving mercy and walking humbly with God, and names Bethlehem as the origin of a coming ruler.',
 p:[
 {t:'fil',l:1,q:'Micah 6:8 says to do justice, love mercy, and walk ______ with your God.',o:['humbly','quickly','openly','daily'],a:0,w:'Micah 6:8.'},
 {t:'con',l:5,q:'Which verse from Micah is quoted in Matthew 2 about Jesus\u2019 birthplace?',o:['Micah 5:2, about Bethlehem','Micah 6:8','Micah 1:1','Micah 7:18'],a:0,w:'The chief priests quote it when Herod asks where the Messiah would be born.'},
 {t:'bok',l:3,q:'Which prophet gave a one-line summary of what God requires and named Bethlehem?',o:['Micah','Amos','Hosea','Nahum'],a:0,w:'Micah — both 6:8 and 5:2.'}
]},
{id:'c_joel_spirit',b:'joe',e:'minorprophets',topic:'The Spirit poured out',d:3,claim:'text',ref:'Joel 2:28-32',
 sum:'Joel promises that God will pour out his Spirit on all people — sons and daughters, old and young, servants included.',
 p:[
 {t:'mc',l:2,q:'Who does Joel say will receive God\u2019s Spirit?',o:['All people — sons and daughters, old and young, male and female servants','Only priests','Only prophets','Only the king'],a:0,w:'Joel 2:28-29 is deliberately expansive.'},
 {t:'con',l:5,q:'Where is Joel 2 quoted in the New Testament?',o:['Peter\u2019s sermon at Pentecost in Acts 2','The Sermon on the Mount','Paul\u2019s speech in Athens','Revelation 21'],a:0,w:'Acts 2:16-21 — Peter uses it to explain what has just happened.'},
 {t:'cse',l:4,q:'What prompts Peter to quote Joel at Pentecost?',o:['The crowd\u2019s accusation that the believers were drunk','A question about the temple','A dispute over food laws','A riot'],a:0,w:'Acts 2:13-16.'}
]}
];
