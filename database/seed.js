const { getDb } = require('./db');
const bcrypt = require('bcryptjs');

function seed() {
    const db = getDb();
    
    // Check if already seeded
    const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
    if (count.c > 0) { console.log('Database already seeded.'); return; }

    // Create admin user
    const hash = bcrypt.hashSync('admin123', 12);
    db.prepare(`INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)`).run('admin', 'admin@aerodefense.com', hash, 'System Admin', 'admin');

    // Products
    const insertProduct = db.prepare(`INSERT INTO products (name, slug, category, manufacturer, country_of_origin, description, long_description, price, status, generation, classification, image_url, featured, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertSpec = db.prepare(`INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, spec_unit, display_order) VALUES (?, ?, ?, ?, ?, ?)`);

    const products = [
        { name:'F-22 Raptor', slug:'f-22-raptor', cat:'fighter-jet', mfr:'Lockheed Martin', origin:'USA', desc:'The world\'s premier 5th-generation air superiority fighter with unmatched stealth and supercruise capability.', price:150000000, status:'available', gen:'5th Gen', cls:'Air Superiority', img:'/images/jets/f22.png', featured:1, stock:3,
          specs:[
            ['Performance','Max Speed','Mach 2.25','',1],['Performance','Supercruise','Mach 1.82','',2],['Performance','Combat Range','759','km',3],['Performance','Service Ceiling','65,000','ft',4],['Performance','Thrust','35,000','lbf per engine',5],
            ['Dimensions','Length','18.92','m',1],['Dimensions','Wingspan','13.56','m',2],['Dimensions','Height','5.08','m',3],['Dimensions','Empty Weight','19,700','kg',4],
            ['Armament','Internal Weapons Bays','3','',1],['Armament','Air-to-Air','6x AIM-120 AMRAAM + 2x AIM-9','',2],['Armament','Gun','M61A2 20mm Vulcan','',3],
            ['Avionics','Radar','AN/APG-77 AESA','',1],['Avionics','EW Suite','AN/ALR-94','',2],['Avionics','Data Link','Link 16 + IFDL','',3]
          ]},
        { name:'F-35A Lightning II', slug:'f-35a-lightning-ii', cat:'fighter-jet', mfr:'Lockheed Martin', origin:'USA', desc:'The most advanced multi-role stealth fighter, combining sensor fusion and network-centric warfare.', price:80000000, status:'available', gen:'5th Gen', cls:'Multirole', img:'/images/jets/f35.png', featured:1, stock:5,
          specs:[
            ['Performance','Max Speed','Mach 1.6','',1],['Performance','Combat Range','1,093','km',2],['Performance','Service Ceiling','50,000','ft',3],
            ['Dimensions','Length','15.67','m',1],['Dimensions','Wingspan','10.7','m',2],['Dimensions','Empty Weight','13,290','kg',3],
            ['Armament','Internal Bay','2x AIM-120 + 2x GBU-31','',1],['Armament','External Pylons','6','',2],['Armament','Gun','GAU-22/A 25mm','',3],
            ['Avionics','Radar','AN/APG-81 AESA','',1],['Avionics','EO/IR','AN/AAQ-40 EOTS','',2],['Avionics','Helmet','Gen III HMDS','',3]
          ]},
        { name:'Su-57 Felon', slug:'su-57-felon', cat:'fighter-jet', mfr:'Sukhoi', origin:'Russia', desc:'Russia\'s 5th-generation stealth fighter with extreme maneuverability and advanced sensor suite.', price:42000000, status:'available', gen:'5th Gen', cls:'Air Superiority', img:'/images/jets/su57.png', featured:1, stock:2,
          specs:[
            ['Performance','Max Speed','Mach 2.0','',1],['Performance','Supercruise','Mach 1.6','',2],['Performance','Range','3,500','km',3],['Performance','Service Ceiling','65,600','ft',4],
            ['Dimensions','Length','20.1','m',1],['Dimensions','Wingspan','14.1','m',2],['Dimensions','Empty Weight','18,000','kg',3],
            ['Armament','Internal Bays','4','',1],['Armament','Payload','10,000','kg',2],['Armament','Gun','GSh-30-1 30mm','',3],
            ['Avionics','Radar','Sh121 AESA','',1],['Avionics','IRST','101KS Atoll','',2]
          ]},
        { name:'Eurofighter Typhoon', slug:'eurofighter-typhoon', cat:'fighter-jet', mfr:'Airbus/BAE Systems', origin:'Europe', desc:'Europe\'s premier swing-role combat aircraft, excelling in both air-to-air and air-to-ground missions.', price:124000000, status:'available', gen:'4.5 Gen', cls:'Multirole', img:'/images/jets/typhoon.png', featured:0, stock:4,
          specs:[
            ['Performance','Max Speed','Mach 2.0','',1],['Performance','Supercruise','Mach 1.5','',2],['Performance','Range','2,900','km',3],
            ['Dimensions','Length','15.96','m',1],['Dimensions','Wingspan','10.95','m',2],['Dimensions','Empty Weight','11,000','kg',3],
            ['Armament','Hardpoints','13','',1],['Armament','Payload','7,500','kg',2],['Armament','Gun','BK-27 27mm','',3],
            ['Avionics','Radar','Captor-E AESA','',1]
          ]},
        { name:'Dassault Rafale', slug:'dassault-rafale', cat:'fighter-jet', mfr:'Dassault Aviation', origin:'France', desc:'France\'s omnirole fighter — carrier-capable, nuclear-capable, battle-proven across global theaters.', price:100000000, status:'available', gen:'4.5 Gen', cls:'Omnirole', img:'/images/jets/rafale.png', featured:0, stock:3,
          specs:[
            ['Performance','Max Speed','Mach 1.8','',1],['Performance','Range','3,700','km',2],['Performance','Service Ceiling','50,000','ft',3],
            ['Dimensions','Length','15.27','m',1],['Dimensions','Wingspan','10.8','m',2],['Dimensions','Empty Weight','10,300','kg',3],
            ['Armament','Hardpoints','14','',1],['Armament','Payload','9,500','kg',2],['Armament','Gun','GIAT 30/719B 30mm','',3],
            ['Avionics','Radar','RBE2 AA AESA','',1],['Avionics','EW','SPECTRA Suite','',2]
          ]},
        { name:'J-20 Mighty Dragon', slug:'j-20-mighty-dragon', cat:'fighter-jet', mfr:'Chengdu Aerospace', origin:'China', desc:'China\'s stealth air superiority fighter with long-range engagement capability and advanced avionics.', price:110000000, status:'pre-order', gen:'5th Gen', cls:'Air Superiority', img:'/images/jets/j20.png', featured:1, stock:1,
          specs:[
            ['Performance','Max Speed','Mach 2.0','',1],['Performance','Range','5,500','km',2],['Performance','Service Ceiling','66,000','ft',3],
            ['Dimensions','Length','20.3','m',1],['Dimensions','Wingspan','13.5','m',2],
            ['Armament','Internal Bays','4','',1],['Armament','Missiles','PL-15, PL-10','',2],
            ['Avionics','Radar','Type 1475 AESA','',1]
          ]},
        { name:'F-15EX Eagle II', slug:'f-15ex-eagle-ii', cat:'fighter-jet', mfr:'Boeing', origin:'USA', desc:'The most advanced Eagle ever built — massive payload, digital backbone, and unmatched combat record.', price:88000000, status:'available', gen:'4.5 Gen', cls:'Multirole', img:'/images/jets/f15ex.png', featured:0, stock:4,
          specs:[
            ['Performance','Max Speed','Mach 2.5','',1],['Performance','Range','3,900','km',2],['Performance','Service Ceiling','65,000','ft',3],
            ['Dimensions','Length','19.43','m',1],['Dimensions','Wingspan','13.05','m',2],['Dimensions','Empty Weight','14,300','kg',3],
            ['Armament','Hardpoints','15+','',1],['Armament','Payload','13,000','kg',2],['Armament','Gun','M61A1 20mm','',3],
            ['Avionics','Radar','AN/APG-82(V)1 AESA','',1],['Avionics','EW','EPAWSS','',2]
          ]},
        { name:'Saab Gripen E', slug:'saab-gripen-e', cat:'fighter-jet', mfr:'Saab', origin:'Sweden', desc:'Cost-effective next-gen fighter with network-centric warfare and short-field operations capability.', price:85000000, status:'available', gen:'4.5 Gen', cls:'Multirole', img:'/images/jets/gripen.png', featured:0, stock:6,
          specs:[
            ['Performance','Max Speed','Mach 2.0','',1],['Performance','Range','3,200','km',2],
            ['Dimensions','Length','15.2','m',1],['Dimensions','Wingspan','8.6','m',2],
            ['Armament','Hardpoints','10','',1],['Armament','Gun','BK-27 27mm','',2],
            ['Avionics','Radar','ES-05 Raven AESA','',1]
          ]},
        { name:'Su-35 Flanker-E', slug:'su-35-flanker-e', cat:'fighter-jet', mfr:'Sukhoi', origin:'Russia', desc:'Ultimate Flanker variant with thrust-vectoring supermaneuverability and Irbis-E long-range radar.', price:65000000, status:'available', gen:'4++ Gen', cls:'Air Superiority', img:'/images/jets/su35.png', featured:0, stock:3,
          specs:[
            ['Performance','Max Speed','Mach 2.25','',1],['Performance','Range','3,600','km',2],['Performance','Service Ceiling','59,000','ft',3],
            ['Dimensions','Length','21.9','m',1],['Dimensions','Wingspan','15.3','m',2],
            ['Armament','Hardpoints','12','',1],['Armament','Payload','8,000','kg',2],['Armament','Gun','GSh-30-1 30mm','',3],
            ['Avionics','Radar','Irbis-E PESA','',1]
          ]},
        { name:'HAL Tejas Mk2', slug:'hal-tejas-mk2', cat:'fighter-jet', mfr:'HAL', origin:'India', desc:'India\'s indigenous light combat aircraft with advanced avionics and modern weapons integration.', price:42000000, status:'pre-order', gen:'4.5 Gen', cls:'Light Combat', img:'/images/jets/tejas.png', featured:0, stock:8,
          specs:[
            ['Performance','Max Speed','Mach 1.8','',1],['Performance','Range','3,000','km',2],
            ['Dimensions','Length','15.7','m',1],['Dimensions','Wingspan','8.5','m',2],
            ['Armament','Hardpoints','11','',1],['Armament','Payload','5,500','kg',2],
            ['Avionics','Radar','Uttam AESA','',1]
          ]},
        // MISSILES
        { name:'AIM-120D AMRAAM', slug:'aim-120d-amraam', cat:'missile', mfr:'Raytheon', origin:'USA', desc:'Beyond-visual-range air-to-air missile with active radar homing and two-way datalink.', price:1800000, status:'available', gen:null, cls:'Air-to-Air / BVR', img:'/images/missiles/aim120.png', featured:1, stock:50,
          specs:[
            ['Performance','Range','180+','km',1],['Performance','Speed','Mach 4','',2],['Performance','Guidance','Active Radar + INS + Datalink','',3],
            ['Dimensions','Length','3.66','m',1],['Dimensions','Diameter','178','mm',2],['Dimensions','Weight','162','kg',3],
            ['Warhead','Type','Blast-Fragmentation','',1],['Warhead','Weight','22.7','kg',2]
          ]},
        { name:'AGM-158 JASSM-ER', slug:'agm-158-jassm-er', cat:'missile', mfr:'Lockheed Martin', origin:'USA', desc:'Extended-range stealthy cruise missile for precision deep-strike against heavily defended targets.', price:3000000, status:'available', gen:null, cls:'Air-to-Ground / Cruise', img:'/images/missiles/jassm.png', featured:0, stock:30,
          specs:[
            ['Performance','Range','1,000+','km',1],['Performance','Speed','Subsonic (High)','',2],['Performance','Guidance','INS/GPS + IR Seeker','',3],
            ['Dimensions','Length','4.27','m',1],['Dimensions','Weight','1,023','kg',2],
            ['Warhead','Type','WDU-42/B Penetrator','',1],['Warhead','Weight','450','kg',2]
          ]},
        { name:'BrahMos-II', slug:'brahmos-ii', cat:'missile', mfr:'BrahMos Aerospace', origin:'India/Russia', desc:'Hypersonic cruise missile capable of Mach 7+ speeds, virtually impossible to intercept.', price:2730000, status:'pre-order', gen:null, cls:'Cruise / Hypersonic', img:'/images/missiles/brahmos.png', featured:1, stock:20,
          specs:[
            ['Performance','Range','600','km',1],['Performance','Speed','Mach 7+','',2],['Performance','Guidance','INS/GPS + Active Radar','',3],
            ['Dimensions','Length','8.4','m',1],['Dimensions','Weight','3,000','kg',2],
            ['Warhead','Type','Semi-Armor Piercing','',1],['Warhead','Weight','300','kg',2]
          ]},
        { name:'BGM-109 Tomahawk', slug:'bgm-109-tomahawk', cat:'missile', mfr:'Raytheon', origin:'USA', desc:'Long-range, all-weather cruise missile — the backbone of U.S. precision strike for three decades.', price:1870000, status:'available', gen:null, cls:'Cruise / Land Attack', img:'/images/missiles/tomahawk.png', featured:0, stock:40,
          specs:[
            ['Performance','Range','2,500','km',1],['Performance','Speed','Mach 0.75','',2],['Performance','Guidance','INS/GPS + TERCOM + DSMAC','',3],
            ['Dimensions','Length','5.56','m',1],['Dimensions','Diameter','518','mm',2],['Dimensions','Weight','1,440','kg',3],
            ['Warhead','Type','WDU-36 Blast-Frag','',1],['Warhead','Weight','450','kg',2]
          ]},
        { name:'Meteor BVRAAM', slug:'meteor-bvraam', cat:'missile', mfr:'MBDA', origin:'Europe', desc:'Ramjet-powered BVR missile with no-escape zone larger than any competitor. Game-changer in air combat.', price:2500000, status:'available', gen:null, cls:'Air-to-Air / BVR', img:'/images/missiles/meteor.png', featured:0, stock:35,
          specs:[
            ['Performance','Range','200+','km',1],['Performance','Speed','Mach 4+','',2],['Performance','Propulsion','Solid-Fuel Ramjet','',3],
            ['Dimensions','Length','3.65','m',1],['Dimensions','Weight','190','kg',2],
            ['Warhead','Type','Blast-Fragmentation','',1]
          ]},
        { name:'IRIS-T SLM', slug:'iris-t-slm', cat:'missile', mfr:'Diehl Defence', origin:'Germany', desc:'Medium-range surface-to-air missile with advanced IR imaging seeker and 360° engagement.', price:430000, status:'available', gen:null, cls:'Surface-to-Air', img:'/images/missiles/irist.png', featured:0, stock:60,
          specs:[
            ['Performance','Range','40','km',1],['Performance','Altitude','20','km',2],['Performance','Speed','Mach 3','',3],
            ['Dimensions','Length','2.94','m',1],['Dimensions','Weight','89','kg',2],
            ['Warhead','Type','HE Fragmentation','',1]
          ]},
        { name:'Kinzhal (Kh-47M2)', slug:'kinzhal-kh47m2', cat:'missile', mfr:'Russian MoD', origin:'Russia', desc:'Air-launched hypersonic ballistic missile — Mach 10 speed makes it nearly impossible to intercept.', price:10000000, status:'classified', gen:null, cls:'Hypersonic / Ballistic', img:'/images/missiles/kinzhal.png', featured:0, stock:5,
          specs:[
            ['Performance','Range','2,000','km',1],['Performance','Speed','Mach 10','',2],['Performance','Guidance','INS + Terminal Radar','',3],
            ['Dimensions','Length','7.0','m',1],['Dimensions','Weight','4,300','kg',2],
            ['Warhead','Type','Nuclear/Conventional','',1],['Warhead','Weight','480','kg',2]
          ]},
        { name:'Storm Shadow / SCALP', slug:'storm-shadow-scalp', cat:'missile', mfr:'MBDA', origin:'UK/France', desc:'Stealthy long-range cruise missile with BROACH tandem warhead for penetrating hardened bunkers.', price:3200000, status:'available', gen:null, cls:'Cruise / Stand-off', img:'/images/missiles/storm-shadow.png', featured:0, stock:25,
          specs:[
            ['Performance','Range','560','km',1],['Performance','Speed','Mach 0.95','',2],['Performance','Guidance','INS/GPS + IR Terminal','',3],
            ['Dimensions','Length','5.1','m',1],['Dimensions','Weight','1,300','kg',2],
            ['Warhead','Type','BROACH Tandem','',1],['Warhead','Weight','450','kg',2]
          ]},
        { name:'AIM-9X Sidewinder', slug:'aim-9x-sidewinder', cat:'missile', mfr:'Raytheon', origin:'USA', desc:'Short-range IR air-to-air missile with thrust vectoring, helmet-cued off-boresight engagement.', price:600000, status:'available', gen:null, cls:'Air-to-Air / WVR', img:'/images/missiles/aim9x.png', featured:0, stock:80,
          specs:[
            ['Performance','Range','35','km',1],['Performance','Speed','Mach 2.5','',2],['Performance','Guidance','Imaging IR + Datalink','',3],
            ['Dimensions','Length','3.02','m',1],['Dimensions','Weight','85.3','kg',2],
            ['Warhead','Type','Annular Blast-Frag','',1],['Warhead','Weight','9.4','kg',2]
          ]},
        { name:'AGM-88G AARGM-ER', slug:'agm-88g-aargm-er', cat:'missile', mfr:'Northrop Grumman', origin:'USA', desc:'Extended-range anti-radiation missile to destroy enemy air defense radar systems.', price:1200000, status:'available', gen:null, cls:'Anti-Radiation', img:'/images/missiles/aargm.png', featured:0, stock:30,
          specs:[
            ['Performance','Range','300+','km',1],['Performance','Speed','Mach 2+','',2],['Performance','Guidance','GPS/INS + Passive Radar + mmW','',3],
            ['Dimensions','Length','4.1','m',1],['Dimensions','Weight','400','kg',2],
            ['Warhead','Type','Blast-Fragmentation','',1]
          ]},
        // DEFENSE SYSTEMS
        { name:'THAAD System', slug:'thaad-system', cat:'defense-system', mfr:'Lockheed Martin', origin:'USA', desc:'Terminal High Altitude Area Defense — intercepts ballistic missiles inside and outside the atmosphere.', price:800000000, status:'available', gen:null, cls:'Anti-Ballistic Missile', img:'/images/defense/thaad.png', featured:1, stock:1,
          specs:[
            ['Performance','Intercept Range','200','km',1],['Performance','Intercept Altitude','150','km',2],['Performance','Interceptor Speed','Mach 8.24','',3],
            ['System','Launchers per Battery','6','',1],['System','Missiles per Launcher','8','',2],['System','Radar','AN/TPY-2 X-Band','',3],
            ['Warhead','Kill Method','Hit-to-Kill (Kinetic)','',1]
          ]},
        { name:'Iron Dome', slug:'iron-dome', cat:'defense-system', mfr:'Rafael Advanced Defense', origin:'Israel', desc:'Combat-proven short-range air defense system with 90%+ interception rate against rockets and missiles.', price:50000000, status:'available', gen:null, cls:'Short-Range Air Defense', img:'/images/defense/iron-dome.png', featured:1, stock:3,
          specs:[
            ['Performance','Intercept Range','4-70','km',1],['Performance','Intercept Success Rate','90%+','',2],
            ['System','Launchers per Battery','3-4','',1],['System','Missiles per Launcher','20','',2],['System','Radar','EL/M-2084 MMR','',3],
            ['Interceptor','Name','Tamir','',1],['Interceptor','Speed','Mach 2.2','',2]
          ]},
        { name:'Aegis Combat System', slug:'aegis-combat-system', cat:'defense-system', mfr:'Lockheed Martin', origin:'USA', desc:'Integrated naval weapons system — the most capable ship-based defense platform ever deployed.', price:1200000000, status:'pre-order', gen:null, cls:'Naval Integrated Defense', img:'/images/defense/aegis.png', featured:0, stock:1,
          specs:[
            ['Performance','Track Capacity','100+ simultaneous','',1],['Performance','Engagement Range','500+','km',2],
            ['System','Radar','AN/SPY-1D(V) / SPY-6(V)1','',1],['System','Missiles','SM-2, SM-3, SM-6, ESSM','',2],['System','VLS Cells','Up to 122','',3],
            ['Capability','BMD','SM-3 Block IIA','',1],['Capability','AAW','SM-6 Extended Range','',2]
          ]},
        { name:'S-400 Triumf', slug:'s-400-triumf', cat:'defense-system', mfr:'Almaz-Antey', origin:'Russia', desc:'Long-range SAM system capable of engaging aircraft, cruise missiles, and ballistic targets simultaneously.', price:500000000, status:'classified', gen:null, cls:'Long-Range SAM', img:'/images/defense/s400.png', featured:0, stock:2,
          specs:[
            ['Performance','Max Range','400','km',1],['Performance','Max Altitude','30','km',2],['Performance','Simultaneous Targets','36','',3],
            ['System','Launchers per Battalion','8','',1],['System','Radar','91N6E Big Bird + 92N6E Gravestone','',2],
            ['Missiles','Types','40N6, 48N6, 9M96','',1]
          ]},
        { name:'Phalanx CIWS', slug:'phalanx-ciws', cat:'defense-system', mfr:'Raytheon', origin:'USA', desc:'Autonomous close-in weapon system — last line of defense against anti-ship missiles and aircraft.', price:5600000, status:'available', gen:null, cls:'Close-In Weapon System', img:'/images/defense/phalanx.png', featured:0, stock:5,
          specs:[
            ['Performance','Rate of Fire','4,500','rpm',1],['Performance','Effective Range','3.6','km',2],['Performance','Tracking','Ku-band Radar (search + track)','',3],
            ['System','Gun','M61A1 Vulcan 20mm','',1],['System','Ammunition','1,550 rounds','',2],['System','Weight','5,700','kg',3]
          ]}
    ];

    const insertAll = db.transaction(() => {
        for (const p of products) {
            const info = insertProduct.run(p.name, p.slug, p.cat, p.mfr, p.origin, p.desc, p.desc, p.price, p.status, p.gen, p.cls, p.img, p.featured, p.stock);
            const productId = info.lastInsertRowid;
            for (const s of p.specs) {
                insertSpec.run(productId, s[0], s[1], s[2], s[3], s[4]);
            }
        }
    });
    insertAll();
    console.log(`Seeded ${products.length} products.`);
}

seed();
