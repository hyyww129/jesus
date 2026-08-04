/* ==========================================================================
   CONCEPT BANK — NEW TESTAMENT
   Same probe grammar as the Old Testament bank.
   ========================================================================== */

const CONCEPTS_NT = [

/* ========================== THE LIFE OF JESUS ========================== */
{id:'c_incarnation',b:'joh',e:'jesus',topic:'The Word made flesh',d:3,claim:'text',ref:'John 1:1-18',
 sum:'John opens not with a birth but with the Word who was with God and was God, through whom everything was made, becoming flesh and living among us.',
 p:[
 {t:'mc',l:1,q:'How does John\u2019s Gospel begin?',o:['With the Word who was in the beginning with God','With a genealogy','With shepherds in a field','With John the Baptist\u2019s birth'],a:0,w:'John 1:1-3.'},
 {t:'con',l:4,q:'Which Old Testament book does John 1:1 deliberately echo in its first three words?',o:['Genesis','Psalms','Isaiah','Daniel'],a:0,w:'"In the beginning" repeats the opening of Genesis 1:1.'},
 {t:'mat',l:4,q:'Match each Gospel to how it opens.',pr:[['Matthew','A genealogy tracing Jesus from Abraham through David'],['Mark','John the Baptist preaching, with no birth account'],['Luke','A formal preface addressed to Theophilus'],['John','The eternal Word, before creation']],w:'Each opening signals what that Gospel most wants its readers to see.'},
 {t:'exp',l:5,q:'Why do the four Gospels start in four different places, and is that a problem?',keys:['audience','emphasis','portrait','witness','complement','purpose','different'],
  model:'Each writer opens where his argument begins. Matthew starts with a genealogy because he presents Jesus as the promised Son of David; Mark starts with action because he emphasises what Jesus does; Luke starts with a historian\u2019s preface because he is writing an ordered account for Theophilus; John starts before creation because he presents Jesus as the eternal Word. The differences are differences of emphasis and audience, giving four complementary portraits rather than four contradictory reports.'}
]},
{id:'c_birth',b:'luk',e:'jesus',topic:'The birth of Jesus',d:1,claim:'text',ref:'Luke 2; Matthew 1–2',
 sum:'Jesus is born in Bethlehem during Herod\u2019s reign; shepherds are told by angels, and later magi from the east follow a star to the child.',
 p:[
 {t:'mc',l:1,q:'In which town is Jesus born?',o:['Bethlehem','Nazareth','Capernaum','Jerusalem'],a:0,w:'Luke 2:4-7; Matthew 2:1.'},
 {t:'cse',l:3,q:'Why were Joseph and Mary in Bethlehem, according to Luke?',o:['A census required Joseph to register in his ancestral town','They had moved there permanently','They were fleeing Herod','They were visiting Elizabeth'],a:0,w:'Luke 2:1-5.'},
 {t:'con',l:5,q:'Which prophet did the chief priests quote when Herod asked where the Messiah would be born?',o:['Micah','Malachi','Zechariah','Hosea'],a:0,w:'Matthew 2:5-6 quotes Micah 5:2.'},
 {t:'tf',l:3,q:'The Gospels state that there were exactly three magi.',o:['True','False'],a:1,w:'False — Matthew mentions three kinds of gift but never gives a number of visitors. The "three kings" detail is later tradition.'},
 {t:'nxt',l:4,q:'What happens shortly after the magi leave, in Matthew 2?',o:['The family flees to Egypt to escape Herod','They return to Bethlehem permanently','Jesus is presented in the temple','John the Baptist is born'],a:0,w:'Matthew 2:13-15.'}
]},
{id:'c_baptism',b:'mat',e:'jesus',topic:'The baptism of Jesus',d:1,claim:'text',ref:'Matthew 3:13-17',
 sum:'John baptises Jesus in the Jordan; the Spirit descends like a dove and a voice from heaven declares him the beloved Son.',
 p:[
 {t:'mc',l:1,q:'Who baptised Jesus?',o:['John the Baptist','Peter','Andrew','Nicodemus'],a:0,w:'Matthew 3:13-15, in the Jordan River.'},
 {t:'mc',l:2,q:'What happened as Jesus came up from the water?',o:['The Spirit descended like a dove and a voice declared him the beloved Son','An earthquake struck','The crowd fled','A star appeared'],a:0,w:'Matthew 3:16-17.'},
 {t:'nxt',l:3,q:'What happens immediately after the baptism?',o:['Jesus is led into the wilderness and tempted','He calls the twelve','He enters Jerusalem','He heals Peter\u2019s mother-in-law'],a:0,w:'Matthew 4:1 follows directly on.'},
 {t:'cse',l:4,q:'Why was John initially reluctant to baptise Jesus?',o:['He said he needed to be baptised by Jesus instead','He did not recognise him','The crowd objected','It was the Sabbath'],a:0,w:'Matthew 3:14.'}
]},
{id:'c_temptation',b:'mat',e:'jesus',topic:'The temptation',d:2,claim:'text',ref:'Matthew 4:1-11',
 sum:'After forty days of fasting Jesus is tempted three times and answers each with a quotation from Deuteronomy.',
 p:[
 {t:'mc',l:2,q:'Which book does Jesus quote in answering all three temptations?',o:['Deuteronomy','Genesis','Psalms','Isaiah'],a:0,w:'Matthew 4:4, 7, 10 all quote Deuteronomy.'},
 {t:'con',l:5,q:'Jesus spends forty days in the wilderness. Which earlier account does this echo?',o:['Israel\u2019s forty years in the wilderness','Noah\u2019s forty days of rain only','Elijah\u2019s contest on Carmel','Jonah\u2019s three days'],a:0,w:'The parallel with Israel is reinforced by the fact that all three answers come from Deuteronomy, Israel\u2019s wilderness book.'},
 {t:'mc',l:3,q:'What is the first temptation?',o:['To turn stones into bread','To take a kingdom by force','To leave Galilee','To call down fire'],a:0,w:'Matthew 4:3.'}
]},
{id:'c_sermon',b:'mat',e:'jesus',topic:'Sermon on the Mount',d:2,claim:'text',ref:'Matthew 5–7',
 sum:'Jesus\u2019 longest recorded teaching: the beatitudes, salt and light, teaching that goes beneath the surface of the law, the Lord\u2019s Prayer, and the two builders.',
 p:[
 {t:'mc',l:1,q:'Which chapters of Matthew contain the Sermon on the Mount?',o:['Matthew 5–7','Matthew 1–2','Matthew 13','Matthew 24–25'],a:0,w:'Matthew 5–7, the first of the Gospel\u2019s five great discourses.'},
 {t:'mc',l:2,q:'How does the Sermon on the Mount begin?',o:['With the beatitudes, a series of blessings','With a warning about judgment','With the Lord\u2019s Prayer','With a parable about seed'],a:0,w:'Matthew 5:3-12.'},
 {t:'cse',l:4,q:'When Jesus says "you have heard it said… but I say to you," what is he doing?',o:['Pressing the commands beneath the surface behaviour to the heart','Cancelling the law entirely','Quoting Roman law','Addressing only priests'],a:0,w:'Matthew 5:17-48; anger and contempt sit behind murder, and so on.'},
 {t:'mc',l:3,q:'How does the sermon end?',o:['With two builders, one on rock and one on sand','With the beatitudes','With a genealogy','With the Great Commission'],a:0,w:'Matthew 7:24-27 — the point being hearing and doing.'},
 {t:'exp',l:5,q:'How does the Sermon on the Mount change the way someone might read the Ten Commandments?',keys:['heart','motive','beneath','anger','intent','not just actions','deeper'],
  model:'Jesus takes commands about visible actions and traces them back to what produces them: murder back to anger and contempt, adultery back to lust, oath-keeping back to plain honesty. He says he came not to abolish the law but to fulfil it, so the effect is to deepen rather than replace it. It becomes much harder to treat obedience as a checklist, since the sermon ends by insisting that hearing the words is not the same as building on them.'}
]},
{id:'c_parables',b:'luk',e:'jesus',topic:'Parables',d:2,claim:'text',ref:'Luke 10; 15; Matthew 13',
 sum:'Jesus taught largely in parables — short stories drawn from ordinary life that reveal the kingdom to those willing to hear and conceal it from those who are not.',
 p:[
 {t:'mc',l:1,q:'In the parable of the good Samaritan, who stops to help the injured man?',o:['A Samaritan','A priest','A Levite','A scribe'],a:0,w:'Luke 10:33; a priest and a Levite both pass by first.'},
 {t:'cse',l:3,q:'What question prompts the parable of the good Samaritan?',o:['"And who is my neighbour?"','"When will the kingdom come?"','"Who is the greatest?"','"Should we pay taxes?"'],a:0,w:'Luke 10:29.'},
 {t:'mat',l:4,q:'Match each parable to its point as the Gospel presents it.',pr:[['The good Samaritan','Neighbour love crosses ethnic and religious lines'],['The prodigal son','A father runs to welcome a returning child'],['The sower','The same message meets different kinds of soil'],['The two builders','Hearing without doing leaves nothing to stand on']],w:'Naming the point rather than just the story is a step up in understanding.'},
 {t:'scn',l:5,q:'Luke 15 tells three parables in a row — a lost sheep, a lost coin, a lost son. What is the effect of grouping them?',o:['They build a cumulative case about God\u2019s joy in recovering what was lost, answering the complaint that Jesus ate with sinners','They are unrelated stories','They warn against carelessness','They describe farming methods'],a:0,w:'Luke 15:1-2 sets up all three with the Pharisees\u2019 complaint.'}
]},
{id:'c_miracles',b:'mrk',e:'jesus',topic:'Miracles of Jesus',d:2,claim:'text',ref:'Mark 4–6; John 6',
 sum:'Jesus calms a storm, feeds five thousand, walks on water, heals, and raises the dead — signs that raise the question of who he is.',
 p:[
 {t:'mc',l:1,q:'What do the disciples ask after Jesus calms the storm?',o:['Who is this, that even the wind and sea obey him?','When will we arrive?','Where is the food?','Why did you sleep?'],a:0,w:'Mark 4:41 — the question the miracles are designed to raise.'},
 {t:'mc',l:2,q:'Which miracle is recorded in all four Gospels?',o:['Feeding the five thousand','Walking on water','Raising Lazarus','Turning water into wine'],a:0,w:'Matthew 14, Mark 6, Luke 9 and John 6 all include it.'},
 {t:'cse',l:4,q:'In John\u2019s Gospel, what word is used for Jesus\u2019 miracles, and why does it matter?',o:['"Signs" — they point beyond themselves to who Jesus is','"Wonders" — they emphasise the crowd\u2019s amazement','"Works" — they emphasise effort','"Proofs" — they compel belief'],a:0,w:'John 20:30-31 states that the signs are written so readers may believe.'},
 {t:'con',l:5,q:'After feeding the crowd, what does Jesus say about himself in John 6?',o:['That he is the bread of life, drawing on the manna in the wilderness','That he will build a temple','That he is Elijah','That he will feed them daily'],a:0,w:'John 6:31-35 quotes the manna account first.'}
]},
{id:'c_twelve',b:'mrk',e:'jesus',topic:'The twelve disciples',d:2,claim:'text',ref:'Mark 3:13-19',
 sum:'Jesus appoints twelve to be with him and to be sent out — fishermen, a tax collector, a zealot, and the one who would betray him.',
 p:[
 {t:'mc',l:2,q:'What two reasons does Mark give for Jesus appointing the twelve?',o:['To be with him, and to be sent out to preach','To manage money and guard him','To write the Gospels','To rule Galilee'],a:0,w:'Mark 3:14 — presence before mission.'},
 {t:'mc',l:2,q:'What was Matthew\u2019s occupation before following Jesus?',o:['Tax collector','Fisherman','Carpenter','Priest'],a:0,w:'Matthew 9:9.'},
 {t:'scn',l:4,q:'What does the makeup of the twelve — fishermen, a tax collector, a zealot — suggest?',o:['Jesus gathered people who would normally have been political and social enemies','They were all trained scholars','They were all from Jerusalem','They were chosen for wealth'],a:0,w:'A tax collector working for Rome and a zealot opposing Rome in the same group is a striking detail.'}
]},
{id:'c_confession',b:'mat',e:'jesus',topic:'Peter\u2019s confession',d:2,claim:'text',ref:'Matthew 16:13-28',
 sum:'At Caesarea Philippi Peter says Jesus is the Messiah, the Son of the living God; Jesus then begins to teach that he must suffer and die, and Peter objects.',
 p:[
 {t:'mc',l:1,q:'Where does Peter confess that Jesus is the Messiah?',o:['Caesarea Philippi','Capernaum','Jerusalem','Bethany'],a:0,w:'Matthew 16:13.'},
 {t:'nxt',l:3,q:'What does Jesus start teaching immediately after Peter\u2019s confession?',o:['That he must suffer, be killed, and be raised','That he will take the throne in Jerusalem','That the disciples should go home','That the temple would be rebuilt'],a:0,w:'Matthew 16:21 — the turning point of the Gospel.'},
 {t:'cse',l:4,q:'Why does Peter rebuke Jesus after the confession?',o:['A suffering Messiah did not fit his expectations','He wanted to lead','He doubted the resurrection','He feared the crowd'],a:0,w:'Matthew 16:22 — Peter gets the title right and the job description wrong.'},
 {t:'exp',l:5,q:'Peter identifies Jesus correctly and is rebuked minutes later. What does that teach about knowing who Jesus is?',keys:['title','expectations','suffering','cross','understand','right words','misunderstand'],
  model:'Peter uses exactly the right title but assumes it means a triumphant king rather than one who suffers. Getting the label right is not the same as understanding what it involves — which is why Jesus immediately links following him with taking up a cross. The passage warns that correct vocabulary can sit alongside badly mistaken expectations.'}
]},
{id:'c_transfiguration',b:'mat',e:'jesus',topic:'The transfiguration',d:2,claim:'text',ref:'Matthew 17:1-13',
 sum:'On a high mountain Jesus is transfigured before Peter, James and John; Moses and Elijah appear, and a voice from the cloud repeats the words spoken at his baptism.',
 p:[
 {t:'mc',l:1,q:'Which two figures appear with Jesus at the transfiguration?',o:['Moses and Elijah','Abraham and David','Isaiah and Jeremiah','Noah and Joshua'],a:0,w:'Matthew 17:3.'},
 {t:'cse',l:5,q:'Why are Moses and Elijah a significant pairing?',o:['They are widely taken to represent the law and the prophets','They were both kings','They both wrote Gospels','They were contemporaries'],a:0,w:'This reading is very widely held; the text itself simply names them.'},
 {t:'mc',l:3,q:'Which three disciples were present?',o:['Peter, James and John','Peter, Andrew and Philip','James, John and Thomas','Peter, Judas and Matthew'],a:0,w:'Matthew 17:1 — the same three appear at other key moments.'}
]},
{id:'c_triumphal',b:'mat',e:'jesus',topic:'The triumphal entry',d:2,claim:'text',ref:'Matthew 21:1-11',
 sum:'Jesus enters Jerusalem riding a donkey while crowds spread cloaks and branches and shout Hosanna — a deliberate fulfilment of Zechariah\u2019s picture of a humble king.',
 p:[
 {t:'mc',l:1,q:'What does Jesus ride into Jerusalem?',o:['A donkey','A horse','A chariot','A camel'],a:0,w:'Matthew 21:7.'},
 {t:'con',l:5,q:'Which prophet described a king coming humbly on a donkey?',o:['Zechariah','Nahum','Joel','Amos'],a:0,w:'Zechariah 9:9, quoted in Matthew 21:5 and John 12:15.'},
 {t:'cse',l:4,q:'What is the significance of choosing a donkey rather than a warhorse?',o:['It presents a king who comes in peace rather than as a conquering general','Donkeys were faster','It was the only animal available','It hid his identity'],a:0,w:'The contrast with a military entry is the point Zechariah draws.'},
 {t:'ord',l:4,q:'Put the events of the final week in order.',it:['The entry into Jerusalem','Clearing the temple','The last supper','Prayer in Gethsemane','Arrest and trials','Crucifixion','The empty tomb'],w:'Holding this week\u2019s sequence is essential for reading all four Gospels.'}
]},
{id:'c_last_supper',b:'luk',e:'jesus',topic:'The last supper',d:2,claim:'text',ref:'Luke 22:7-23; John 13',
 sum:'At a Passover meal Jesus gives bread and cup a new meaning, foretells his betrayal, and in John\u2019s account washes the disciples\u2019 feet.',
 p:[
 {t:'mc',l:1,q:'What festival was being observed at the last supper?',o:['Passover','Pentecost','Tabernacles','Purim'],a:0,w:'Luke 22:7-15.'},
 {t:'con',l:5,q:'Why does the Passover setting matter for how the meal is understood?',o:['Jesus reinterprets a meal about rescue from Egypt around his own death','It was simply the next available date','It marked the harvest','It was a Roman requirement'],a:0,w:'The exodus background is what gives the bread and cup their meaning.'},
 {t:'mc',l:2,q:'What does Jesus do at the meal in John\u2019s account that the other Gospels do not record?',o:['Washes the disciples\u2019 feet','Multiplies the bread','Heals a servant','Reads from Isaiah'],a:0,w:'John 13:1-17.'}
]},
{id:'c_crucifixion',b:'mrk',e:'jesus',topic:'The crucifixion',d:1,claim:'text',ref:'Mark 15; Luke 23',
 sum:'Jesus is arrested in Gethsemane, tried before the Jewish council and Pilate, and crucified at Golgotha between two criminals; the temple curtain is torn.',
 p:[
 {t:'mc',l:1,q:'Which Roman governor sentenced Jesus?',o:['Pontius Pilate','Herod Antipas','Felix','Festus'],a:0,w:'Mark 15:15.'},
 {t:'mc',l:2,q:'What happens to the temple curtain at the moment of Jesus\u2019 death?',o:['It is torn in two from top to bottom','It catches fire','It is removed by priests','Nothing is recorded'],a:0,w:'Mark 15:38 — widely read as access to God being opened.'},
 {t:'ord',l:3,q:'Put the events of Jesus\u2019 arrest and death in order.',it:['Prayer in Gethsemane','Betrayal by Judas and arrest','Trial before the Jewish council','Trial before Pilate','Crucifixion at Golgotha','Burial in a tomb'],w:'The sequence is consistent across the Gospels, with each giving different detail.'},
 {t:'cse',l:4,q:'What charge was fixed above Jesus\u2019 head on the cross?',o:['King of the Jews','Blasphemer','Rebel against Rome','Sorcerer'],a:0,w:'Mark 15:26 — a political charge stated in royal terms.'},
 {t:'bok',l:3,q:'Which books contain accounts of the crucifixion?',o:['All four Gospels','Only Mark','Only John','Acts and Romans'],a:0,w:'Matthew 27, Mark 15, Luke 23 and John 19.'}
]},
{id:'c_resurrection',b:'luk',e:'jesus',topic:'The resurrection',d:1,claim:'text',ref:'Luke 24; 1 Corinthians 15',
 sum:'On the third day the tomb is found empty; Jesus appears to women first, then to disciples on the road to Emmaus and to the wider group over forty days.',
 p:[
 {t:'mc',l:1,q:'Who first discovers the empty tomb in the Gospel accounts?',o:['Women who came to the tomb','Peter','Pilate\u2019s guards alone','Two priests'],a:0,w:'Luke 24:1-10; all four Gospels place women first.'},
 {t:'mc',l:2,q:'What happens on the road to Emmaus?',o:['Jesus walks with two disciples and explains the scriptures before they recognise him','Peter is arrested','A storm strikes','The disciples return to fishing'],a:0,w:'Luke 24:13-35.'},
 {t:'con',l:5,q:'Why does Paul say in 1 Corinthians 15 that the resurrection is essential?',o:['If Christ has not been raised, the faith and the preaching are empty','It proves the law was abolished','It explains the temple\u2019s destruction','It settles a dispute about food'],a:0,w:'1 Corinthians 15:14-17.'},
 {t:'exp',l:5,q:'What difference does the resurrection make to how the crucifixion is understood?',keys:['vindication','not defeat','accepted','new life','hope','death defeated','beginning'],
  model:'Without the resurrection the crucifixion would read as the defeat of another failed movement. The resurrection presents it instead as something accomplished and accepted — God\u2019s vindication of Jesus rather than a tragedy reversed by wishful thinking. It is why the first Christians preached a crucified man as Lord, and why Paul can argue that everything collapses if it did not happen.'}
]},
{id:'c_ascension',b:'act',e:'jesus',topic:'The ascension and commission',d:2,claim:'text',ref:'Matthew 28:16-20; Acts 1:1-11',
 sum:'Jesus commissions his followers to make disciples of all nations, promises the Spirit, and is taken up into heaven.',
 p:[
 {t:'mc',l:2,q:'What does Acts 1:8 give as the plan for the witness?',o:['Jerusalem, Judea and Samaria, and the ends of the earth','Rome, Athens and Corinth','Galilee only','Egypt and Assyria'],a:0,w:'It also serves as the outline of the book of Acts.'},
 {t:'con',l:4,q:'How does the Great Commission connect back to Genesis 12?',o:['Both concern blessing reaching all nations','Both concern land ownership','Both describe a flood','Both name Abraham as leader'],a:0,w:'Genesis 12:3 promised blessing to all families of the earth; the commission sends witnesses to all nations.'},
 {t:'mc',l:2,q:'What are the disciples told to wait for before beginning?',o:['The gift of the Holy Spirit','A new temple','A ship','Paul\u2019s arrival'],a:0,w:'Acts 1:4-5.'}
]},

/* ============================ EARLY CHURCH ============================ */
{id:'c_pentecost',b:'act',e:'church',topic:'Pentecost',d:1,claim:'text',ref:'Acts 2',
 sum:'The Spirit comes with wind and fire; the believers speak in other languages, Peter preaches from Joel, and about three thousand are added.',
 p:[
 {t:'mc',l:1,q:'What accompanies the coming of the Spirit at Pentecost?',o:['A sound like a rushing wind and what looked like tongues of fire','An earthquake','A bright star','Total silence'],a:0,w:'Acts 2:2-3.'},
 {t:'cse',l:3,q:'Why were people from many nations in Jerusalem that day?',o:['They had gathered for the festival of Pentecost','They were fleeing persecution','A census had been called','A trial was underway'],a:0,w:'Acts 2:5-11 lists the regions represented.'},
 {t:'con',l:5,q:'Which prophet does Peter quote to explain what is happening?',o:['Joel','Isaiah','Micah','Malachi'],a:0,w:'Acts 2:16-21 quotes Joel 2:28-32.'},
 {t:'mc',l:2,q:'About how many people were added that day?',o:['Three thousand','Twelve','Five hundred','Seventy'],a:0,w:'Acts 2:41.'},
 {t:'scn',l:5,q:'At Babel one language became many and people scattered. At Pentecost many languages hear one message. How should that link be described?',o:['A widely drawn connection between the two accounts, not something Acts states directly','A claim Acts makes explicitly','A modern misreading rejected by scholars','A quotation from Genesis in Acts 2'],a:0,w:'The parallel is a reading many Christians find compelling; Acts does not name Babel.'}
]},
{id:'c_community',b:'act',e:'church',topic:'The first community',d:2,claim:'text',ref:'Acts 2:42-47',
 sum:'The first believers devoted themselves to the apostles\u2019 teaching, fellowship, breaking bread and prayer, shared possessions as needs arose, and grew daily.',
 p:[
 {t:'mc',l:2,q:'What four things does Acts 2:42 say the believers devoted themselves to?',o:['The apostles\u2019 teaching, fellowship, breaking bread and prayer','Fasting, silence, travel and building','Law, sacrifice, tithe and festival','Preaching, writing, sailing and trading'],a:0,w:'Acts 2:42.'},
 {t:'cse',l:4,q:'How does Acts describe the sharing of possessions in the early community?',o:['Believers sold property as needs arose and distributed to any who had need','A compulsory equal division was enforced','Property was banned','Only apostles owned anything'],a:0,w:'Acts 2:45 and 4:34-35 describe voluntary response to actual need.'},
 {t:'con',l:4,q:'Which later episode shows the sharing was voluntary, not compulsory?',o:['Peter\u2019s words to Ananias in Acts 5, that the property and money were his own','The stoning of Stephen','The Jerusalem council','The Ethiopian official\u2019s baptism'],a:0,w:'Acts 5:4 — the issue was the lie, not the withholding.'}
]},
{id:'c_stephen',b:'act',e:'church',topic:'Stephen',d:2,claim:'text',ref:'Acts 6–8',
 sum:'Stephen, chosen to help serve widows, gives a long defence retelling Israel\u2019s history and is stoned while Saul looks on; persecution then scatters the church.',
 p:[
 {t:'mc',l:1,q:'What happens to Stephen after his speech before the council?',o:['He is stoned to death','He is imprisoned','He is exiled','He is released'],a:0,w:'Acts 7:57-60.'},
 {t:'cse',l:4,q:'What is the immediate consequence of Stephen\u2019s death for the church?',o:['Persecution scatters believers, who spread the message beyond Jerusalem','The church closes','The apostles leave for Rome','Persecution stops'],a:0,w:'Acts 8:1-4 — the scattering advances the mission described in Acts 1:8.'},
 {t:'con',l:4,q:'Who is named as approving Stephen\u2019s execution?',o:['Saul, later called Paul','Peter','Barnabas','Cornelius'],a:0,w:'Acts 7:58; 8:1 — a deliberate introduction of the man who becomes the apostle to the Gentiles.'}
]},
{id:'c_philip',b:'act',e:'church',topic:'Philip and the Ethiopian',d:2,claim:'text',ref:'Acts 8:26-40',
 sum:'Philip meets an Ethiopian court official reading Isaiah 53, explains that the passage speaks of Jesus, and baptises him.',
 p:[
 {t:'mc',l:2,q:'What was the Ethiopian official reading when Philip met him?',o:['Isaiah','Genesis','Psalms','Daniel'],a:0,w:'Acts 8:28-33 quotes Isaiah 53.'},
 {t:'con',l:5,q:'Why is this episode important in the structure of Acts?',o:['It shows the message moving beyond Jerusalem and Judea toward the ends of the earth','It marks the founding of the church at Antioch','It records the first martyrdom','It begins Paul\u2019s first journey'],a:0,w:'It follows the Acts 1:8 outline: Jerusalem, then Judea and Samaria, then further out.'},
 {t:'cse',l:3,q:'What does the official do immediately after Philip explains the passage?',o:['He asks to be baptised when they reach water','He returns to Jerusalem','He writes to his queen','He asks Philip to travel with him'],a:0,w:'Acts 8:36-38 — the response is immediate.'}
]},
{id:'c_cornelius',b:'act',e:'church',topic:'Cornelius',d:2,claim:'text',ref:'Acts 10–11',
 sum:'A vision prepares Peter to enter the home of Cornelius, a Roman centurion; the Spirit comes on his household, and they are baptised.',
 p:[
 {t:'mc',l:2,q:'What was Cornelius\u2019s position?',o:['A Roman centurion','A Jewish priest','A Greek philosopher','An Egyptian official'],a:0,w:'Acts 10:1.'},
 {t:'cse',l:3,q:'What prepares Peter to go to a Gentile home?',o:['A vision of a sheet with animals and a voice telling him not to call unclean what God has made clean','A letter from James','A dream about Rome','A command from the council'],a:0,w:'Acts 10:9-16.'},
 {t:'con',l:5,q:'Why does Acts 10 matter for the argument settled in Acts 15?',o:['It establishes that God gave the Spirit to Gentiles without requiring them to become Jewish first','It proves circumcision is required','It settles a dispute about money','It records Paul\u2019s conversion'],a:0,w:'Peter recounts this exact event at the Jerusalem council (Acts 15:7-11).'},
 {t:'ord',l:4,q:'Put the Acts 10 sequence in order.',it:['Cornelius has a vision and sends for Peter','Peter sees the vision of the sheet','Peter travels to Caesarea','Peter preaches in Cornelius\u2019s house','The Spirit comes on the listeners','They are baptised'],w:'Two visions converging is the chapter\u2019s structure.'}
]},
{id:'c_antioch',b:'act',e:'church',topic:'Antioch',d:2,claim:'text',ref:'Acts 11:19-26',
 sum:'Scattered believers preach to Greeks in Antioch; Barnabas is sent, fetches Saul from Tarsus, and there the disciples are first called Christians.',
 p:[
 {t:'mc',l:2,q:'Where were believers first called Christians?',o:['Antioch','Jerusalem','Rome','Ephesus'],a:0,w:'Acts 11:26.'},
 {t:'cse',l:4,q:'Why does Antioch matter for the rest of Acts?',o:['It became the sending base for Paul\u2019s missionary journeys','It replaced Jerusalem as the capital','It was where the Gospels were written','It was Peter\u2019s permanent home'],a:0,w:'Acts 13:1-3 records the church there sending out Barnabas and Saul.'},
 {t:'mc',l:3,q:'Who brought Saul from Tarsus to Antioch?',o:['Barnabas','Peter','Silas','Timothy'],a:0,w:'Acts 11:25-26 — another example of Barnabas taking a risk on him.'}
]},

/* =========================== PAUL'S MINISTRY =========================== */
{id:'c_saul_conv',b:'act',e:'paul',topic:'Conversion of Saul',d:1,claim:'text',ref:'Acts 9:1-19',
 sum:'On the road to Damascus with arrest warrants, Saul is struck by a light and hears Jesus ask why he is persecuting him; blinded, he is sent to Ananias.',
 p:[
 {t:'mc',l:1,q:'Where was Saul travelling when he encountered the risen Jesus?',o:['On the road to Damascus','On the road to Rome','On the road to Emmaus','On the road to Jericho'],a:0,w:'Acts 9:3.'},
 {t:'cse',l:3,q:'What question does the voice ask Saul?',o:['Why he is persecuting Jesus','Where he is going','Who sent him','Why he left Tarsus'],a:0,w:'Acts 9:4 — the striking point is that persecuting the church is described as persecuting Jesus.'},
 {t:'nxt',l:3,q:'What happens immediately after the encounter?',o:['Saul is blind for three days and then Ananias is sent to him','He preaches at once in Jerusalem','He returns to Tarsus','He is arrested'],a:0,w:'Acts 9:8-19.'},
 {t:'scn',l:5,q:'Ananias objects when told to go to Saul. What does his obedience make possible?',o:['The restoration and commissioning of the church\u2019s most effective missionary','A truce with the council','The founding of Antioch','Peter\u2019s release from prison'],a:0,w:'Acts 9:13-17 — an ordinary believer\u2019s risky obedience at a pivotal moment.'}
]},
{id:'c_journeys',b:'act',e:'paul',topic:'Paul\u2019s missionary journeys',d:2,claim:'text',ref:'Acts 13–20',
 sum:'Sent from Antioch, Paul makes three journeys through Cyprus, Asia Minor, Macedonia and Greece, planting churches he later writes to.',
 p:[
 {t:'mc',l:2,q:'Which city sent Paul and Barnabas out on the first journey?',o:['Antioch in Syria','Jerusalem','Corinth','Ephesus'],a:0,w:'Acts 13:1-3.'},
 {t:'mat',l:4,q:'Match each city to what happened there.',pr:[['Philippi','Lydia believed and Paul and Silas were jailed'],['Athens','Paul spoke at the Areopagus about an unknown god'],['Ephesus','Two years of daily teaching, ending in a silversmiths\u2019 riot'],['Corinth','An eighteen-month stay, working as a tentmaker']],w:'Linking city to event is the fastest way to hold Acts 13–20 together.'},
 {t:'mc',l:3,q:'Who travelled with Paul on the second journey after he and Barnabas parted?',o:['Silas, later joined by Timothy','Barnabas and Mark','Peter and John','Luke alone'],a:0,w:'Acts 15:40 – 16:3.'},
 {t:'con',l:5,q:'Why do the journeys matter for reading Paul\u2019s letters?',o:['Most letters are addressed to churches he planted or visited on these journeys','The letters were all written before the journeys','The journeys are unrelated to the letters','The letters describe the journeys in full'],a:0,w:'Philippians, 1–2 Thessalonians, 1–2 Corinthians, Galatians and Ephesians all connect to places in Acts 13–20.'}
]},
{id:'c_council',b:'act',e:'paul',topic:'The Jerusalem council',d:3,claim:'text',ref:'Acts 15',
 sum:'Leaders meet to settle whether Gentile believers must be circumcised; after testimony from Peter, Paul, Barnabas and James, they conclude they need not be.',
 p:[
 {t:'cse',l:3,q:'What question prompted the Jerusalem council?',o:['Whether Gentile believers had to be circumcised and keep the law of Moses to be saved','Whether to appoint more apostles','Where to build a temple','How to distribute money'],a:0,w:'Acts 15:1-5.'},
 {t:'mc',l:3,q:'Who summarised the decision at the council?',o:['James','Peter','Paul','Barnabas'],a:0,w:'Acts 15:13-21.'},
 {t:'con',l:5,q:'Which of Paul\u2019s letters argues the same case with particular force?',o:['Galatians','Philemon','2 Thessalonians','Titus'],a:0,w:'Galatians deals directly with the pressure on Gentile believers to take on the law.'},
 {t:'exp',l:5,q:'Why was the Jerusalem council such a significant moment for the church?',keys:['Gentile','circumcision','law','unity','not required','faith','one people'],
  model:'The decision settled whether following Jesus meant first becoming Jewish. By concluding that Gentile believers need not be circumcised, the council made it possible for the church to be genuinely international rather than a movement within one nation. It also modelled how a serious disagreement was handled: testimony from experience, appeal to scripture, and a decision communicated in writing to the affected churches.'}
]},
{id:'c_philippi',b:'act',e:'paul',topic:'Philippi',d:2,claim:'text',ref:'Acts 16',
 sum:'In Philippi Lydia believes and opens her home; Paul and Silas are jailed, sing at midnight, and an earthquake leads to the jailer\u2019s household believing.',
 p:[
 {t:'who',l:2,clues:['I dealt in purple cloth','I met Paul at a riverside prayer meeting','I was baptised with my household','I opened my home to the first church in Europe'],o:['Lydia','Priscilla','Phoebe','Dorcas'],a:0,w:'Lydia — Acts 16:14-15.'},
 {t:'nxt',l:3,q:'What happens after the earthquake opens the prison doors?',o:['Paul stops the jailer harming himself, and the jailer\u2019s household believes','Paul and Silas escape','The city is destroyed','The magistrates are arrested'],a:0,w:'Acts 16:27-34.'},
 {t:'con',l:4,q:'Which letter was later written to this church?',o:['Philippians','Philemon','Colossians','Titus'],a:0,w:'Philippians — a warm letter to a church that partnered with Paul.'}
]},
{id:'c_areopagus',b:'act',e:'paul',topic:'Paul in Athens',d:3,claim:'text',ref:'Acts 17:16-34',
 sum:'In Athens Paul speaks at the Areopagus, starting from an altar to an unknown god and quoting Greek poets before speaking of resurrection.',
 p:[
 {t:'cse',l:3,q:'What does Paul use as his starting point in Athens?',o:['An altar he had seen inscribed to an unknown god','A quotation from Isaiah','The Ten Commandments','A miracle he had performed'],a:0,w:'Acts 17:23.'},
 {t:'scn',l:5,q:'Paul quotes Greek poets rather than Hebrew scripture in this speech. What does that show?',o:['He adapted his starting point to his audience while arriving at the same message','He abandoned the scriptures','He was addressing a synagogue','He avoided mentioning Jesus'],a:0,w:'Compare his synagogue speeches, which argue from the scriptures. The destination — resurrection — stays the same.'},
 {t:'mc',l:3,q:'What part of Paul\u2019s message divided his Athenian audience?',o:['The resurrection of the dead','The idea of one God','The mention of poetry','His reference to the altar'],a:0,w:'Acts 17:32.'}
]},
{id:'c_rome',b:'act',e:'paul',topic:'Paul reaches Rome',d:2,claim:'text',ref:'Acts 21–28',
 sum:'Arrested in Jerusalem, held at Caesarea, and appealing to Caesar, Paul survives a shipwreck and reaches Rome, where he teaches under house arrest.',
 p:[
 {t:'cse',l:3,q:'Why is Paul sent to Rome?',o:['He appealed to Caesar as a Roman citizen','He was invited by the church there','He was exiled','He was pursuing Peter'],a:0,w:'Acts 25:11-12.'},
 {t:'ord',l:4,q:'Put the final section of Acts in order.',it:['Paul is arrested in the temple in Jerusalem','He is held at Caesarea and tried before governors','He appeals to Caesar','He is shipwrecked on Malta','He arrives in Rome','He teaches under house arrest'],w:'Acts ends with the gospel reaching the empire\u2019s capital — the fulfilment of Acts 1:8.'},
 {t:'scn',l:5,q:'Acts ends without telling us what happened to Paul. What effect does that have?',o:['It keeps the focus on the unhindered spread of the message rather than one man\u2019s fate','It suggests the manuscript was lost','It proves Paul was released','It indicates the book is unfinished'],a:0,w:'The final verse emphasises preaching without hindrance — an ending many readers find deliberate.'}
]},

/* ============================== LETTERS ============================== */
{id:'c_rom_faith',b:'rom',e:'letters',topic:'Justified by faith',d:3,claim:'text',ref:'Romans 3–4',
 sum:'Paul argues that all have sinned and fall short, and that people are put right with God as a gift through faith rather than by keeping the law.',
 p:[
 {t:'fil',l:1,q:'Romans 3:23 says all have sinned and fall short of the ______ of God.',o:['glory','law','image','kingdom'],a:0,w:'Romans 3:23.'},
 {t:'con',l:5,q:'Which Old Testament figure does Paul use in Romans 4 to prove his point?',o:['Abraham, counted righteous by faith before circumcision','Moses, who received the law','David, who built the temple','Noah, who built the ark'],a:0,w:'Paul quotes Genesis 15:6 and stresses that circumcision came afterwards.'},
 {t:'scn',l:5,q:'Someone says Paul\u2019s teaching on faith means behaviour does not matter. How does Romans answer?',o:['Paul raises the objection himself and rejects it, going on to describe a transformed life in the Spirit','Paul agrees','Paul never addresses it','Paul says only the law matters'],a:0,w:'Romans 6:1-2 raises and dismisses exactly that objection, and Romans 8 describes life in the Spirit.'},
 {t:'bok',l:3,q:'Which letter contains Paul\u2019s fullest treatment of justification by faith?',o:['Romans','Philemon','1 Thessalonians','Titus'],a:0,w:'Romans, with Galatians making a shorter and sharper version of the case.'}
]},
{id:'c_1cor_love',b:'1co',e:'letters',topic:'Love in 1 Corinthians 13',d:2,claim:'text',ref:'1 Corinthians 12–14',
 sum:'Between two chapters on spiritual gifts, Paul insists that without love the most impressive gifts are worth nothing.',
 p:[
 {t:'cse',l:3,q:'What is the context of 1 Corinthians 13?',o:['It sits between two chapters about spiritual gifts in a divided church','It is a wedding sermon','It closes the letter','It answers a question about food'],a:0,w:'The placement is the point: love governs how gifts are used.'},
 {t:'mc',l:3,q:'What does Paul say gifts amount to without love?',o:['Nothing','More than love','A partial reward','A lesser gift'],a:0,w:'1 Corinthians 13:1-3.'},
 {t:'scn',l:5,q:'The chapter is often read at weddings. What does its original setting add?',o:['It was written to a church that was arguing, making it a correction as much as a celebration','It was originally about marriage','It has no original setting','It was a hymn'],a:0,w:'Reading it in context makes it considerably more demanding.'}
]},
{id:'c_1cor_res',b:'1co',e:'letters',topic:'Resurrection in 1 Corinthians 15',d:3,claim:'text',ref:'1 Corinthians 15',
 sum:'Paul lists the resurrection appearances, argues that Christian faith collapses without the resurrection, and describes the resurrection body.',
 p:[
 {t:'mc',l:2,q:'What does Paul say follows if Christ has not been raised?',o:['Preaching and faith are both empty','The law still stands','Only the Gentiles are affected','Nothing changes'],a:0,w:'1 Corinthians 15:14.'},
 {t:'mc',l:3,q:'What does Paul call Christ in relation to those who have died?',o:['The firstfruits','The final prophet','The second Adam only','The cornerstone'],a:0,w:'1 Corinthians 15:20 — firstfruits implies a harvest to follow.'},
 {t:'con',l:5,q:'How does 1 Corinthians 15 connect back to Genesis?',o:['Paul compares Adam and Christ as two representative figures','He retells the flood','He quotes the creation days','He discusses Babel'],a:0,w:'1 Corinthians 15:21-22, 45-49.'}
]},
{id:'c_gal_freedom',b:'gal',e:'letters',topic:'Freedom in Galatians',d:3,claim:'text',ref:'Galatians 2–5',
 sum:'Paul confronts pressure on Gentile believers to take on the law, insists righteousness comes by faith, and describes the fruit the Spirit produces.',
 p:[
 {t:'cse',l:3,q:'What problem is Galatians written to address?',o:['Teachers insisting Gentile believers must be circumcised and keep the law','A famine','A dispute about leadership succession','Persecution by Rome'],a:0,w:'Galatians 1:6-7; 5:2-6.'},
 {t:'mc',l:3,q:'What does Paul list as the fruit of the Spirit?',o:['Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self-control','Faith, hope and love only','Wisdom, knowledge and power','Prophecy, tongues and healing'],a:0,w:'Galatians 5:22-23.'},
 {t:'con',l:5,q:'Which event in Acts covers the same controversy?',o:['The Jerusalem council in Acts 15','Pentecost in Acts 2','The stoning of Stephen in Acts 7','The shipwreck in Acts 27'],a:0,w:'Both concern whether Gentiles must become Jewish to belong.'}
]},
{id:'c_eph_grace',b:'eph',e:'letters',topic:'Grace and the new humanity',d:2,claim:'text',ref:'Ephesians 2',
 sum:'Salvation is by grace through faith, not by works — and the same grace joins Jews and Gentiles into one new humanity.',
 p:[
 {t:'fil',l:1,q:'Ephesians 2:8 says it is by grace you have been saved, through ______.',o:['faith','works','the law','tradition'],a:0,w:'Ephesians 2:8-9.'},
 {t:'cse',l:4,q:'What does the second half of Ephesians 2 apply that grace to?',o:['The joining of Jews and Gentiles into one new humanity','The rebuilding of the temple','The structure of households','Financial giving'],a:0,w:'Ephesians 2:14-16 — the dividing wall of hostility broken down.'},
 {t:'mc',l:3,q:'What does Ephesians 2:10 add immediately after saying salvation is not by works?',o:['That believers are created for good works','That works are irrelevant','That the law is restored','That faith is a work'],a:0,w:'Works are the result, not the cause.'}
]},
{id:'c_php_humility',b:'php',e:'letters',topic:'Humility in Philippians 2',d:2,claim:'text',ref:'Philippians 2:1-11',
 sum:'Paul urges the church to consider others better than themselves, pointing to Christ who did not cling to equality with God but took the form of a servant.',
 p:[
 {t:'cse',l:3,q:'Why does Paul include the passage about Christ\u2019s humility?',o:['As the model for how the Philippians should treat one another','As a hymn with no application','To settle a legal question','To explain the resurrection'],a:0,w:'Philippians 2:5 makes the connection explicit.'},
 {t:'mc',l:2,q:'From what circumstance was Philippians written?',o:['Imprisonment','A sea voyage','A synagogue in Corinth','The Jerusalem council'],a:0,w:'Philippians 1:12-14; the emphasis on joy is striking given the setting.'},
 {t:'scn',l:5,q:'What makes Philippians\u2019 repeated theme of joy notable?',o:['It is written from prison to a church facing pressure, so joy is not framed as an easy mood','It was written during peace and prosperity','It contains no hardship','It is addressed to wealthy patrons'],a:0,w:'The circumstances make the theme a claim rather than a platitude.'}
]},
{id:'c_heb_priest',b:'heb',e:'letters',topic:'Christ as high priest',d:3,claim:'text',ref:'Hebrews 4:14 – 10:18',
 sum:'Hebrews argues that Jesus is a greater high priest who sympathises with weakness and offered himself once for all, replacing repeated sacrifices.',
 p:[
 {t:'mc',l:2,q:'What does Hebrews say is different about Christ\u2019s sacrifice?',o:['It was offered once for all rather than repeated','It was offered yearly','It required a new temple','It applied only to priests'],a:0,w:'Hebrews 9:26-28; 10:10-14.'},
 {t:'con',l:5,q:'Which Old Testament ritual does Hebrews use as its main comparison?',o:['The Day of Atonement','Passover','The Jubilee','The wave offering'],a:0,w:'Hebrews 9 works directly from Leviticus 16.'},
 {t:'mat',l:5,q:'Match each Old Testament element to the Hebrews comparison.',pr:[['The tabernacle','A copy and shadow of a greater sanctuary'],['The high priest','A forerunner of a greater and permanent priest'],['Repeated sacrifices','Replaced by one offering made once for all'],['Jeremiah\u2019s new covenant','Quoted as fulfilled in Christ']],w:'Hebrews works through these comparisons systematically.'}
]},
{id:'c_jas_works',b:'jas',e:'letters',topic:'Faith and works in James',d:3,claim:'debated',ref:'James 2:14-26',
 sum:'James argues that faith without works is dead, using Abraham and Rahab as examples of faith demonstrated in action.',
 p:[
 {t:'mc',l:2,q:'What does James say about faith that produces no action?',o:['It is dead','It is sufficient','It is superior','It is invisible but complete'],a:0,w:'James 2:17, 26.'},
 {t:'con',l:5,q:'Both Paul and James cite Abraham. How is the relationship best described?',o:['Christians read them as addressing different questions, though they have long discussed how the two fit together','They flatly contradict each other with no resolution','James is correcting Paul by name','Paul never mentions Abraham'],a:0,w:'A common reading is that Paul addresses how someone is put right with God and James how genuine faith shows itself. Christians hold different views on the precise relationship.'},
 {t:'mc',l:3,q:'Which two examples does James use?',o:['Abraham and Rahab','Moses and Joshua','David and Solomon','Peter and Paul'],a:0,w:'James 2:21-25.'}
]},

/* ============================= REVELATION ============================= */
{id:'c_seven_churches',b:'rev',e:'revelation',topic:'The seven churches',d:2,claim:'text',ref:'Revelation 2–3',
 sum:'Seven real churches in Asia Minor each receive a message assessing their condition, with commendation, correction and a promise to those who overcome.',
 p:[
 {t:'mc',l:2,q:'How many churches receive messages in Revelation 2–3?',o:['Seven','Twelve','Three','Ten'],a:0,w:'Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia and Laodicea.'},
 {t:'cse',l:3,q:'What pattern do most of the messages follow?',o:['Commendation, correction, and a promise to the one who overcomes','Only condemnation','Only praise','A list of names'],a:0,w:'The structure is deliberate and repeated, with variations.'},
 {t:'con',l:4,q:'Where were these seven churches located?',o:['Asia Minor, in what is now Turkey','Greece','Italy','Egypt'],a:0,w:'They were real congregations in a region Paul had also worked in.'}
]},
{id:'c_throne',b:'rev',e:'revelation',topic:'The throne and the Lamb',d:3,claim:'text',ref:'Revelation 4–5',
 sum:'John sees a throne surrounded by worship, a sealed scroll no one can open, and then a Lamb looking as though slain who is worthy to open it.',
 p:[
 {t:'cse',l:3,q:'Why does John weep in Revelation 5?',o:['No one is found worthy to open the sealed scroll','The churches have failed','The city is destroyed','He is imprisoned'],a:0,w:'Revelation 5:4.'},
 {t:'mc',l:4,q:'John is told to look for a Lion, but what does he see?',o:['A Lamb looking as though it had been slain','An eagle','A throne only','A scroll unrolling itself'],a:0,w:'Revelation 5:5-6 — the reversal is one of the book\u2019s most quoted images.'},
 {t:'scn',l:5,q:'What does the Lion-then-Lamb reversal suggest about how Revelation defines victory?',o:['Conquest happens through self-giving death rather than force','Victory requires military strength','The Lamb image is a mistake','The two images are unrelated'],a:0,w:'This reading is very widely held and shapes how many Christians read the rest of the book.'}
]},
{id:'c_new_creation',b:'rev',e:'revelation',topic:'New heaven and new earth',d:2,claim:'text',ref:'Revelation 21–22',
 sum:'John sees a new heaven and new earth and a city coming down, where God dwells with people, death is gone, and the tree of life appears again.',
 p:[
 {t:'mc',l:2,q:'What does Revelation 21 say God does with his people in the new creation?',o:['He dwells with them','He removes them to a distant place','He appoints rulers over them','He returns them to Eden unchanged'],a:0,w:'Revelation 21:3.'},
 {t:'con',l:5,q:'Which detail in Revelation 22 deliberately echoes Genesis 2?',o:['The tree of life','The ark','The tower','The rainbow'],a:0,w:'Revelation 22:2 — the Bible ends with an image from its opening chapters.'},
 {t:'exp',l:5,q:'How do the last two chapters of Revelation relate to the first two chapters of Genesis?',keys:['tree of life','garden','city','God with people','restored','beginning','end','curse'],
  model:'Genesis opens with God making a good world and walking with people in a garden; Revelation closes with a renewed creation and a city where God lives among his people, with the tree of life present again and the curse gone. The arc is not simply a return to the beginning — it ends in a city rather than a garden — but the echoes are deliberate, framing the whole Bible as one story from creation through rupture to renewal.'}
]},
{id:'c_rev_reading',b:'rev',e:'revelation',topic:'How to read Revelation',d:3,claim:'debated',ref:'Revelation 1:1-3',
 sum:'Revelation is apocalyptic literature full of symbols. Christians who take it seriously read its imagery within several different frameworks.',
 p:[
 {t:'mc',l:3,q:'How should the differences between Christian frameworks for reading Revelation be described?',o:['A genuine disagreement among careful Christians, not a settled matter','A dispute only among non-believers','Resolved by the text itself in chapter 1','Unimportant to the book'],a:0,w:'Thoughtful Christians hold several different frameworks. A learning tool should present the disagreement rather than pick a winner silently.'},
 {t:'mc',l:3,q:'What kind of literature is Revelation?',o:['Apocalyptic, using vision and symbol','A legal code','A biography','A collection of proverbs'],a:0,w:'It shares a genre with parts of Daniel and Ezekiel, which shapes how its images work.'},
 {t:'con',l:5,q:'Which Old Testament books does Revelation draw on most heavily?',o:['Daniel, Ezekiel, Isaiah and Exodus','Ruth and Esther','Proverbs and Ecclesiastes','1 and 2 Chronicles'],a:0,w:'Revelation is saturated with Old Testament imagery, which is why it is difficult to read on its own.'}
]}
];
