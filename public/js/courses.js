'use strict';

'use strict';

// ─────────────────────────────────────────────
//  COURSE DATA  —  public/js/courses.js
//  All 16 courses consumed by booking.js
// ─────────────────────────────────────────────

const COURSES = {

  'close-protection': {
    name: 'Close Protection & FREC 3', tag: 'Course', price: '£2600', priceNum: 2600,
    desc: 'Our Close Protection course is run over 23 days, which includes both security and medical lessons, depending on your requirements. The course can also be tailored to suit any specific needs. By working closely with your organisation, we can conduct an analysis of your situation and provide the best solutions possible for your employees. COURSE SYLLABUS: Unit 1 & 2 Principles & working as a Close protection officer',
    features: [
      'Roles and Responsibilities', 'Legislation of a CP Operative', 'Threat Assessment',
      'Risk Management', 'Personal & Professional Skills', 'Enhanced Surveillance Package',
      'Search Procedures', 'Foot Drills', 'Venue Security', 'Route Planning',
      'Reconnaissance', 'Transport Management', 'Planning & Operating Units 3,4,5 & 6',
      'Conflict Management within the Private Security Industry',
      'Principles of Terror Threat Awareness in the Private Security Industry',
      'Door Supervision responsibilities for Close Protection Operatives',
      'Physical Intervention within the private security industry'
    ],
    dates: [
      { label: 'June 15 – July 8', duration: '23 days',  spots: '8 places left', low: false },
      // { label: 'Feb 10 – 18', duration: '9 days',  spots: '8 places left', low: false },
      // { label: 'Mar 2 – 10',  duration: '9 days',  spots: '3 places left', low: true  }
    ]
  },

  'door-supervisor': {
    name: 'Door Supervisor with EFAW', tag: 'Course', price: '£300', priceNum: 300,
    desc: 'Our Door Supervisors course can be run over 7 days, which can include both security and medical lessons, depending on your requirements. The course can also be tailored to suit any specific needs. The Qualification comprises 4 mandatory Units.',
    features: [
      'Unit 1 – Working within the Private Security Industry',
      'Unit 2 – Working as a Door Supervisor within the Private Security Industry',
      'Unit 3 – Conflict Management within the Private Security Industry',
      'Unit 4 – Physical Intervention within the Private Security Industry',
      'First Aid at Work / Emergency First Aid at Work'
    ],
    dates: [
      { label: 'April 6 – 12', duration: '7 days', spots: '8 places left', low: true  },
      { label: 'May 4 – 10', duration: '7 days', spots: '8 places left', low: false },
      { label: 'May 18 – 24',  duration: '7 days', spots: '9 places left', low: false },
      { label: 'July 13 – 19',  duration: '7 days', spots: '9 places left', low: false }
    ]
  },

  'security-officer': {
    name: 'Security Officer', tag: 'Course', price: '£260', priceNum: 260,
    desc: 'Our Security Officers course can be run over 6 days, which can include both security and medical lessons. This qualification consists of four units which learners must complete successfully in order to achieve the qualification.',
    features: [
      'Unit 1 – Working within the Private Security Industry',
      'Unit 2 – Working as a Security Officer within the Private Security Industry',
      'Unit 3 – Conflict Management within the Private Security Industry',
      'First Aid at Work / Emergency First Aid at Work'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: '9 days', spots: '6 places left', low: false },
      { label: 'Feb 10 – 18', duration: '9 days', spots: '4 places left', low: true  },
      { label: 'Mar 2 – 10',  duration: '9 days', spots: '8 places left', low: false }
    ]
  },

  'stewarding': {
    name: 'Stewarding', tag: 'Course', price: '£110', priceNum: 110,
    desc: 'Stewards are what keep festivals running; helping control crowds, directing attendees to the right location, pointing out amenities, and creating a happy, vibrant atmosphere. Stewarding is a fantastic way to see the UKs best events while making a difference.',
    features: [
      'Spectator Safety Award', 'Crowd Management', 'Event Safety Procedures',
      'Emergency Evacuation', 'Communication Skills', 'Course Certificate'
    ],
    dates: [
      { label: 'April 20 – 22', duration: '3 days', spots: '10 places left', low: false },
      { label: 'June 5 – 7', duration: '3 days', spots: '8 places left',  low: false },
      // { label: 'Mar 2 – 10',  duration: '3 days', spots: '2 places left',  low: true  }
    ]
  },

  'cctv': {
    name: 'CCTV', tag: 'Course', price: '£240', priceNum: 240,
    desc: 'CCTV operators work in control rooms monitoring images and reporting crime. The SIA CCTV training course is 3 days and assessed by 2 multiple choice exams and a practical assessment. You will attain a Level 2 Qualification In CCTV Operations.',
    features: [
      'SIA CCTV Operator Award', 'Camera Operation', 'GDPR & Legal Compliance',
      'Incident Recording', 'Monitoring Procedures', 'Course Certificate'
    ],
    dates: [
      { label: 'Apr 27 – 29', duration: '3 days', spots: '6 places left', low: false },
      { label: 'July 20 – 22', duration: '3 days', spots: '8 places left', low: false }
      // { label: 'Mar 2 – 10',  duration: '5 days', spots: '4 places left', low: false }
    ]
  },

  'conflict-management': {
    name: 'Conflict Management', tag: 'Course', price: '£90', priceNum: 90,
    desc: 'Practical training in de-escalation, communication strategies, and situational awareness. Essential for anyone working in public-facing or security environments.',
    features: [
      'De-escalation Techniques', 'Communication Strategies', 'Situational Awareness',
      'Post-Incident Reporting', 'Corporate Risk Assessment', '24/7 Tutor Access'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: '2 days', spots: '8 places left', low: false },
      { label: 'Feb 10 – 18', duration: '2 days', spots: '6 places left', low: false },
      { label: 'Mar 2 – 10',  duration: '2 days', spots: '3 places left', low: true  }
    ]
  },

  'physical-intervention': {
    name: 'Physical Intervention', tag: 'Course', price: '£90', priceNum: 90,
    desc: 'Covers breakaway techniques, restraint procedures, and the legal use of force. Designed for security professionals who may face physical confrontations in the course of their duties.',
    features: [
      'Breakaway Techniques', 'Restraint Procedures', 'Legal Use of Force',
      'Personal Safety', 'Scenario-Based Training', '24/7 Tutor Support'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: '2 days', spots: '6 places left', low: false },
      { label: 'Feb 10 – 18', duration: '2 days', spots: '4 places left', low: true  },
      { label: 'Mar 2 – 10',  duration: '2 days', spots: '8 places left', low: false }
    ]
  },

  'personal-safety-awareness': {
    name: 'Personal Safety Awareness', tag: 'Course', price: '£30', priceNum: 30,
    desc: 'Covers personal safety risk awareness, correct use of safety equipment, emergency procedures, and legislative compliance. Suitable for all workplace staff.',
    features: [
      'Personal Safety Risk Awareness', 'Safety Equipment Handling', 'Emergency Procedures',
      'Legislative Compliance', 'Employee Responsibilities', 'Course Certificate'
    ],
    dates: [
      { label: 'April 18', duration: '1 day', spots: '10 places left', low: false },
       { label: 'June 28', duration: '1 day', spots: '10 places left', low: false },
      // { label: 'Mar 2 – 10',  duration: '1 day', spots: '5 places left',  low: false }
    ]
  },

  'first-aid-at-work': {
    name: 'First Aid at Work', tag: 'Course', price: '£170', priceNum: 170,
    desc: 'HSE-regulated three-day First Aid at Work qualification. Covers CPR, AED use, wound and fracture care, and a wide range of medical emergencies.',
    features: [
      'HSE Regulated FAW', 'CPR & AED Use', 'Wound & Fracture Care',
      'Medical Emergencies', 'Practical Scenarios', 'Course Certificate'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: '3 days', spots: '8 places left', low: false },
      { label: 'Feb 10 – 18', duration: '3 days', spots: '6 places left', low: false },
      { label: 'Mar 2 – 10',  duration: '3 days', spots: '4 places left', low: false }
    ]
  },

  'frec3': {
    name: 'FREC 3', tag: 'Course', price: '£490', priceNum: 490,
    desc: 'First Response Emergency Care Level 3 — pre-hospital emergency care qualification covering airway management, trauma assessment, and patient monitoring.',
    features: [
      'Pre-hospital Emergency Care', 'Airway Management', 'Trauma Assessment',
      'Patient Monitoring', 'Practical Scenarios', 'Course Certificate'
    ],
    dates: [
      { label: 'June 15 – 19', duration: '5 days', spots: '6 places left', low: false },
      // { label: 'Feb 10 – 18', duration: '5 days', spots: '4 places left', low: true  },
      // { label: 'Mar 2 – 10',  duration: '5 days', spots: '8 places left', low: false }
    ]
  },

  'efaw': {
    name: 'EFAW', tag: 'Course', price: '£70', priceNum: 70,
    desc: 'Emergency First Aid at Work — one day HSE-regulated course covering CPR, AED basics, choking, bleeding, shock, and burns. Ideal for workplace first aiders.',
    features: [
      'Emergency First Aid', 'CPR & AED Basics', 'Choking & Bleeding',
      'Shock & Burns', 'Practical Scenarios', 'Course Certificate'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: '1 day', spots: '12 places left', low: false },
      { label: 'Feb 10 – 18', duration: '1 day', spots: '10 places left', low: false },
      { label: 'Mar 2 – 10',  duration: '1 day', spots: '6 places left',  low: false }
    ]
  },

  'mental-health': {
    name: 'Mental Health', tag: 'Course', price: '£75', priceNum: 75,
    desc: 'Mental Health First Aid training — covering crisis identification, de-escalation support, and how to signpost individuals to appropriate resources. Vital for security professionals.',
    features: [
      'Mental Health First Aid', 'Crisis Identification', 'De-escalation Support',
      'Signposting Resources', 'Practical Scenarios', '24/7 Tutor Access'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: '2 days', spots: '8 places left', low: false },
      { label: 'Feb 10 – 18', duration: '2 days', spots: '6 places left', low: false },
      { label: 'Mar 2 – 10',  duration: '2 days', spots: '3 places left', low: true  }
    ]
  },

  'cp-refresher': {
    name: 'Close Protection (Refresher)', tag: 'Refresher', price: '£360', priceNum: 360,
    desc: 'Designed for anyone who needs to renew their CP licence. Your last CP licence must not have expired more than 3 years ago. You must hold a minimum Level 3 Award in First Aid at Work.',
    features: [
      'Principles of Terror Threat Awareness',
      'Principles of Working as a Door Supervisor for CP Operatives',
      'Application of Physical Intervention Skills'
    ],
    dates: [
      { label: 'Mar 20 – 22', duration: '3 days', spots: '5 places left', low: true  },
      { label: 'May 15 – 17', duration: '3 days', spots: '6 places left', low: false },
      // { label: 'Mar 2 – 10',  duration: '3 days', spots: '5 places left', low: false }
    ]
  },

  'efaw-refresher': {
    name: 'EFAW (Refresher)', tag: 'Refresher', price: '£75', priceNum: 75,
    desc: 'Annual refresher for EFAW certificate holders. Keeps CPR and AED skills current with the latest Resuscitation Council guidelines.',
    features: [
      'CPR Skills Update', 'AED Practical Review', 'Updated Guidelines',
      'Scenario Practice', 'Certificate Renewal', 'Half Day Course'
    ],
    dates: [
      { label: 'Jan 12 – 20', duration: 'Half day', spots: '12 places left', low: false },
      { label: 'Feb 10 – 18', duration: 'Half day', spots: '10 places left', low: false },
      { label: 'Mar 2 – 10',  duration: 'Half day', spots: '8 places left',  low: false }
    ]
  },

  'so-refresher': {
    name: 'Security Officer (Refresher)', tag: 'Refresher', price: '£195', priceNum: 195,
    desc: 'SIA licence renewal for qualified Security Guards. Updated patrol procedures, legislation changes, and practical guarding skills review.',
    features: [
      'SIA Licence Renewal', 'Updated Patrol Skills', 'Guarding Review',
      'One-on-One Support', 'Legislation Update', '24/7 Tutor Support'
    ],
    dates: [
      { label: 'Mar 26 – 27', duration: '2 days', spots: '6 places left', low: false },
      { label: 'Apr 4 – 5', duration: '2 days', spots: '6 places left', low: false }
      // { label: 'Mar 2 – 10',  duration: '2 days', spots: '3 places left', low: true  }
    ]
  },

  'ds-refresher': {
    name: 'Door Supervisor (Refresher)', tag: 'Refresher', price: '£200', priceNum: 200,
    desc: 'SIA licence renewal for qualified Door Supervisors. Covers physical intervention updates, conflict management review, and the latest legislative changes.',
    features: [
      'SIA Licence Renewal', 'Physical Intervention Update', 'Conflict Management Review',
      'Legislation Changes', 'Scenario-Based Training', 'Course Certificate'
    ],
    dates: [
      { label: 'Mar 16 – 18', duration: '3 days', spots: '6 places left', low: false },
      { label: 'May 29 – 31', duration: '3 days', spots: '7 places left', low: false },
      { label: 'Jun 8 – 10',  duration: '3 days', spots: '7 places left', low: true  }
    ]
  },

  'fire-safety-marshall': {
    name: 'Fire Safety Marshall', tag: 'Course', price: '£110', priceNum: 110,
    desc: 'Our Fire Safety Marshall course is designed to provide comprehensive training on fire safety procedures and protocols.',
    features: [
      'Fire Risk Assessment', 'Fire Wardrobe Procedures', 'Fire Drill Procedures', 'Fire Safety Certificate'
    ],
    dates: [
      { label: 'April 30', duration: '1 days', spots: '6 places left', low: false },
      // { label: 'May 29 – 31', duration: '3 days', spots: '7 places left', low: false },
      // { label: 'Jun 8 – 10',  duration: '3 days', spots: '7 places left', low: true  }
    ]
  },
  'gap-year-safety-awareness': {
    name: 'Gap Year Safety Awareness', tag: 'Course', price: '£100', priceNum: 100,
    desc: 'Our Gap Year Safety Awareness course is designed to provide comprehensive training on safety procedures and protocols for young adults.',
    features: [
      'Risk Assessment', 'Safety Procedures', 'Emergency Response', 'Safety Certificate'
    ],
    dates: [
      { label: 'June 15 – July 8', duration: '1 day', spots: '8 places left', low: false }
    ]
  }

};



// const COURSES = {
//     'close-protection': {
//       name:'Close Protection', tag:'Course', price:'£995', priceNum:995,
//       desc:'Our Close Protection course is run over 23 days, which includes both security and medical lessons, depending on your requirements. The course can also be tailored to suit any specific needs. By working closely with your organisation, we can conduct an analysis of your situation and provide the best solutions possible for your employees. COURSE SYLLABUS: Unit 1 & 2 Principles & working as a Close protection officer',
      
//       features:['Roles and Responsibilities','Legislation of a CP Operative','Threat Assesment','Risk Management','Personal & Professional Skills','Enhanced Surveillance package','Search Procedures','Foot Drills','Venue Security','Route Planning','Reconnaissance','Transport Management','Planning & Operating Units 3,4,5 & 6','Cnflict Management within the Private Security Industry','Principles of Terror Threat Awareness in the Private Security Industry','Door Supervision responsibilities for Close Protection Operatives','Physical Intervention within the private security industry, including breakaway techniques, restraint procedures, and legal use of force'],
//       dates:[{label:'Jan 12 – 20',duration:'9 days',spots:'6 places left',low:false},{label:'Feb 10 – 18',duration:'9 days',spots:'8 places left',low:false},{label:'Mar 2 – 10',duration:'9 days',spots:'3 places left',low:true}]
//     },
//     'door-supervisor': {
//       name:'Door Supervisor', tag:'Course', price:'£695', priceNum:695,
//       desc:'Our Door Supervisors course can be run over 7 days, which can include both security and medical lessons, depending on your requirements. The course can also be tailored to suit any specific needs. By working closely with your organisation, we can conduct an analysis of your situation and provide the best solutions possible for your employees. The Qualification comprises 4 mandatory Units: ',
//       features:['Unit 1- Working within the Private Security Industry','Unit 2- Working as a Door Supervisor within the Private Security Industry','Unit 3- Conflict Management within the Private Security Industry','Unit 4- Physical Intervention within the Private Security Industry',' First aid at Work/Emergency First aid at Work'],
//       dates:[{label:'Jan 12 – 20',duration:'9 days',spots:'5 places left',low:true},{label:'Feb 10 – 18',duration:'9 days',spots:'8 places left',low:false},{label:'Mar 2 – 10',duration:'9 days',spots:'7 places left',low:false}]
//     },
//     'security-officer': {
//       name:'Security Officer', tag:'Course', price:'£495', priceNum:495,
//       desc:'Our Security Officers course can be run over 6 days, which can include both security and medical lessons, depending on your requirements. The course can also be tailored to suit any specific needs. By working closely with your organisation, we can conduct an analysis of your situation and provide the best solutions possible for your employees This qualification consists of Four units, which learners must complete successfully in order to achieve the qualification, they are: ',
//       features:['Unit 1- Working within the Private Security Industry','Unit 2- Working as a Security Officer within the Private Security Industry','Unit 3- Conflict Management within the Private Security Industry',' First aid at Work/Emergency First aid at Work'],
//       dates:[{label:'Jan 12 – 20',duration:'9 days',spots:'6 places left',low:false},{label:'Feb 10 – 18',duration:'9 days',spots:'4 places left',low:true},{label:'Mar 2 – 10',duration:'9 days',spots:'8 places left',low:false}]
//     },
//     'stewarding': {
//       name:'Stewarding', tag:'Course', price:'£195', priceNum:195,
//       desc:'Stewards are what keep festivals running; helping control crowds, directing attendees to the right location, pointing out ameniities, and creating a happy, vibrant atmosphere. As a festival steward, you might be needed in a multitude of different jobs; from helping people park safely, to giving information and directing attendees around the site.With shifts designed with your enjoyment in mind, stewarding is a fantastic way to see the UKs best while making a difference to everyone who attends.',
//       features:['Spectator Safety Award','Crowd Management','Event Safety Procedures','Emergency Evacuation','Communication Skills','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'3 days',spots:'10 places left',low:false},{label:'Feb 10 – 18',duration:'3 days',spots:'8 places left',low:false},{label:'Mar 2 – 10',duration:'3 days',spots:'2 places left',low:true}]
//     },
//     'cctv': {
//       name:'CCTV', tag:'Course', price:'£395', priceNum:395,
//       desc:'CCTV operators work in control rooms monitoring images and reporting crime. They are a vital part of the UKs security infrastructure. The SIA CCTV training course is a good course for new entrants or the perfect supplementary qualification for Door Supervisors wishing to take a step up in their career. The CCTV Course is a 3-day training and is assessed by 2 multiple choice exams and a practical assessment. You will attain a Level 2 Qualification In CCTV Operations which will make you eligible for an SIA CCTV License or Public Space Surveillance License. ',
//       features:['SIA CCTV Operator Award','Camera Operation','GDPR & Legal Compliance','Incident Recording','Monitoring Procedures','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'5 days',spots:'6 places left',low:false},{label:'Feb 10 – 18',duration:'5 days',spots:'8 places left',low:false},{label:'Mar 2 – 10',duration:'5 days',spots:'4 places left',low:false}]
//     },
//     'conflict-management': {
//       name:'Conflict Management', tag:'Course', price:'£195', priceNum:195,
//       desc:'Practical training in de-escalation, communication strategies, and situational awareness. Essential for anyone working in public-facing or security environments.',
//       features:['De-escalation Techniques','Communication Strategies','Situational Awareness','Post-Incident Reporting','Corporate Risk Assessment','24/7 Tutor Access'],
//       dates:[{label:'Jan 12 – 20',duration:'2 days',spots:'8 places left',low:false},{label:'Feb 10 – 18',duration:'2 days',spots:'6 places left',low:false},{label:'Mar 2 – 10',duration:'2 days',spots:'3 places left',low:true}]
//     },
//     'physical-intervention': {
//       name:'Physical Intervention', tag:'Course', price:'£295', priceNum:295,
//       desc:'Covers breakaway techniques, restraint procedures, and the legal use of force. Designed for security professionals who may face physical confrontations in the course of their duties.',
//       features:['Breakaway Techniques','Restraint Procedures','Legal Use of Force','Personal Safety','Scenario-Based Training','24/7 Tutor Support'],
//       dates:[{label:'Jan 12 – 20',duration:'2 days',spots:'6 places left',low:false},{label:'Feb 10 – 18',duration:'2 days',spots:'4 places left',low:true},{label:'Mar 2 – 10',duration:'2 days',spots:'8 places left',low:false}]
//     },
//     'fire-safety': {
//       name:'Fire Safety', tag:'Course', price:'£175', priceNum:175,
//       desc:'Covers fire risk awareness, correct use of extinguishers, evacuation procedures, and legislative compliance. Suitable for fire wardens and all workplace staff.',
//       features:['Fire Risk Awareness','Extinguisher Handling','Evacuation Procedures','Legislative Compliance','Warden Responsibilities','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'1 day',spots:'12 places left',low:false},{label:'Feb 10 – 18',duration:'1 day',spots:'10 places left',low:false},{label:'Mar 2 – 10',duration:'1 day',spots:'5 places left',low:false}]
//     },
//     'first-aid-at-work': {
//       name:'First Aid at Work', tag:'Course', price:'£295', priceNum:295,
//       desc:'HSE-regulated three-day First Aid at Work qualification. Covers CPR, AED use, wound and fracture care, and a wide range of medical emergencies.',
//       features:['HSE Regulated FAW','CPR & AED Use','Wound & Fracture Care','Medical Emergencies','Practical Scenarios','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'3 days',spots:'8 places left',low:false},{label:'Feb 10 – 18',duration:'3 days',spots:'6 places left',low:false},{label:'Mar 2 – 10',duration:'3 days',spots:'4 places left',low:false}]
//     },
//     'frec3': {
//       name:'FREC 3', tag:'Course', price:'£595', priceNum:595,
//       desc:'First Response Emergency Care Level 3 — pre-hospital emergency care qualification covering airway management, trauma assessment, and patient monitoring.',
//       features:['Pre-hospital Emergency Care','Airway Management','Trauma Assessment','Patient Monitoring','Practical Scenarios','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'5 days',spots:'6 places left',low:false},{label:'Feb 10 – 18',duration:'5 days',spots:'4 places left',low:true},{label:'Mar 2 – 10',duration:'5 days',spots:'8 places left',low:false}]
//     },
//     'efaw': {
//       name:'EFAW', tag:'Course', price:'£125', priceNum:125,
//       desc:'Emergency First Aid at Work — one day HSE-regulated course covering CPR, AED basics, choking, bleeding, shock, and burns. Ideal for workplace first aiders.',
//       features:['Emergency First Aid','CPR & AED Basics','Choking & Bleeding','Shock & Burns','Practical Scenarios','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'1 day',spots:'12 places left',low:false},{label:'Feb 10 – 18',duration:'1 day',spots:'10 places left',low:false},{label:'Mar 2 – 10',duration:'1 day',spots:'6 places left',low:false}]
//     },
//     'mental-health': {
//       name:'Mental Health', tag:'Course', price:'£195', priceNum:195,
//       desc:'Mental Health First Aid training — covering crisis identification, de-escalation support, and how to signpost individuals to appropriate resources. Vital for security professionals.',
//       features:['Mental Health First Aid','Crisis Identification','De-escalation Support','Signposting Resources','Practical Scenarios','24/7 Tutor Access'],
//       dates:[{label:'Jan 12 – 20',duration:'2 days',spots:'8 places left',low:false},{label:'Feb 10 – 18',duration:'2 days',spots:'6 places left',low:false},{label:'Mar 2 – 10',duration:'2 days',spots:'3 places left',low:true}]
//     },
//     'cp-refresher': {
//       name:'Close Protection (Refresher)', tag:'Refresher', price:'£395', priceNum:395,
//       desc:'This qualification is designed for anyone who needs to renew their CP licence. Your last CP licence must not have expired more than 3 years ago at the time of completing the course. You must hold a minimum of a level 3 Award in First Aid at Work which will not expire within the next 12 months. If you require a First Aid/FREC 3 Certificate we can assist with this.',
//       features:['Principles of Terror Threat Awareness in the Private Security Industry.','Principles Of Working as a Door Supervisor for Close Protection Operatives.','Application of physical intervention skills in the private security industry.'],
//       dates:[{label:'Jan 12 – 20',duration:'3 days',spots:'4 places left',low:true},{label:'Feb 10 – 18',duration:'3 days',spots:'6 places left',low:false},{label:'Mar 2 – 10',duration:'3 days',spots:'5 places left',low:false}]
//     },
//     'efaw-refresher': {
//       name:'EFAW (Refresher)', tag:'Refresher', price:'£75', priceNum:75,
//       desc:'Annual refresher for EFAW certificate holders. Keeps CPR and AED skills current with the latest Resuscitation Council guidelines.',
//       features:['CPR Skills Update','AED Practical Review','Updated Guidelines','Scenario Practice','Certificate Renewal','Half Day Course'],
//       dates:[{label:'Jan 12 – 20',duration:'Half day',spots:'12 places left',low:false},{label:'Feb 10 – 18',duration:'Half day',spots:'10 places left',low:false},{label:'Mar 2 – 10',duration:'Half day',spots:'8 places left',low:false}]
//     },
//     'so-refresher': {
//       name:'Security Officer (Refresher)', tag:'Refresher', price:'£195', priceNum:195,
//       desc:'SIA licence renewal for qualified Security Guards. Updated patrol procedures, legislation changes, and practical guarding skills review.',
//       features:['SIA Licence Renewal','Updated Patrol Skills','Guarding Review','One-on-One Support','Legislation Update','24/7 Tutor Support'],
//       dates:[{label:'Jan 12 – 20',duration:'2 days',spots:'6 places left',low:false},{label:'Feb 10 – 18',duration:'2 days',spots:'4 places left',low:false},{label:'Mar 2 – 10',duration:'2 days',spots:'3 places left',low:true}]
//     },
//     'ds-refresher': {
//       name:'Door Supervisor (Refresher)', tag:'Refresher', price:'£295', priceNum:295,
//       desc:'SIA licence renewal for qualified Door Supervisors. Covers physical intervention updates, conflict management review, and the latest legislative changes.',
//       features:['SIA Licence Renewal','Physical Intervention Update','Conflict Management Review','Legislation Changes','Scenario-Based Training','Course Certificate'],
//       dates:[{label:'Jan 12 – 20',duration:'2 days',spots:'5 places left',low:false},{label:'Feb 10 – 18',duration:'2 days',spots:'7 places left',low:false},{label:'Mar 2 – 10',duration:'2 days',spots:'2 places left',low:true}]
//     }
//   };
