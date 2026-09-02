export interface DistrictInfo {
  name: string;
  postalCode: string;
}

export interface ProvinceInfo {
  name: string;
  districts: DistrictInfo[];
}

const RAW_THAI_PROVINCES: ProvinceInfo[] = [
  {
    name: 'กรุงเทพมหานคร',
    districts: [
      { name: 'พระนคร', postalCode: '10200' },
      { name: 'ดุสิต', postalCode: '10300' },
      { name: 'หนองจอก', postalCode: '10530' },
      { name: 'บางรัก', postalCode: '10500' },
      { name: 'บางเขน', postalCode: '10220' },
      { name: 'บางกะปิ', postalCode: '10240' },
      { name: 'ปทุมวัน', postalCode: '10330' },
      { name: 'ป้อมปราบศัตรูพ่าย', postalCode: '10100' },
      { name: 'พระโขนง', postalCode: '10260' },
      { name: 'มีนบุรี', postalCode: '10510' },
      { name: 'ลาดกระบัง', postalCode: '10520' },
      { name: 'ยานนาวา', postalCode: '10120' },
      { name: 'สัมพันธวงศ์', postalCode: '10100' },
      { name: 'พญาไท', postalCode: '10400' },
      { name: 'ธนบุรี', postalCode: '10600' },
      { name: 'บางกอกใหญ่', postalCode: '10600' },
      { name: 'ห้วยขวาง', postalCode: '10310' },
      { name: 'คลองสาน', postalCode: '10600' },
      { name: 'ตลิ่งชัน', postalCode: '10170' },
      { name: 'บางกอกน้อย', postalCode: '10700' },
      { name: 'บางขุนเทียน', postalCode: '10150' },
      { name: 'ภาษีเจริญ', postalCode: '10160' },
      { name: 'หนองแขม', postalCode: '10160' },
      { name: 'ราษฎร์บูรณะ', postalCode: '10140' },
      { name: 'บางพลัด', postalCode: '10700' },
      { name: 'ดินแดง', postalCode: '10400' },
      { name: 'บึงกุ่ม', postalCode: '10240' },
      { name: 'สาทร', postalCode: '10120' },
      { name: 'บางซื่อ', postalCode: '10800' },
      { name: 'จตุจักร', postalCode: '10900' },
      { name: 'บางคอแหลม', postalCode: '10120' },
      { name: 'ประเวศ', postalCode: '10250' },
      { name: 'คลองเตย', postalCode: '10110' },
      { name: 'สวนหลวง', postalCode: '10250' },
      { name: 'จอมทอง', postalCode: '10150' },
      { name: 'ดอนเมือง', postalCode: '10210' },
      { name: 'ราชเทวี', postalCode: '10400' },
      { name: 'ลาดพร้าว', postalCode: '10230' },
      { name: 'วัฒนา', postalCode: '10110' },
      { name: 'บางแค', postalCode: '10160' },
      { name: 'หลักสี่', postalCode: '10210' },
      { name: 'สายไหม', postalCode: '10220' },
      { name: 'คันนายาว', postalCode: '10230' },
      { name: 'สะพานสูง', postalCode: '10240' },
      { name: 'วังทองหลาง', postalCode: '10310' },
      { name: 'คลองสามวา', postalCode: '10510' },
      { name: 'บางนา', postalCode: '10260' },
      { name: 'ทวีวัฒนา', postalCode: '10170' },
      { name: 'ทุ่งครุ', postalCode: '10140' },
      { name: 'บางบอน', postalCode: '10150' },
    ],
  },
  {
    name: 'นนทบุรี',
    districts: [
      { name: 'เมืองนนทบุรี', postalCode: '11000' },
      { name: 'บางกรวย', postalCode: '11130' },
      { name: 'บางใหญ่', postalCode: '11140' },
      { name: 'บางบัวทอง', postalCode: '11110' },
      { name: 'ไทรน้อย', postalCode: '11150' },
      { name: 'ปากเกร็ด', postalCode: '11120' },
    ],
  },
  {
    name: 'ปทุมธานี',
    districts: [
      { name: 'เมืองปทุมธานี', postalCode: '12000' },
      { name: 'คลองหลวง', postalCode: '12120' },
      { name: 'ธัญบุรี', postalCode: '12110' },
      { name: 'หนองเสือ', postalCode: '12170' },
      { name: 'ลาดหลุมแก้ว', postalCode: '12140' },
      { name: 'ลำลูกกา', postalCode: '12130' },
      { name: 'สามโคก', postalCode: '12160' },
    ],
  },
  {
    name: 'สมุทรปราการ',
    districts: [
      { name: 'เมืองสมุทรปราการ', postalCode: '10270' },
      { name: 'บางบ่อ', postalCode: '10560' },
      { name: 'บางพลี', postalCode: '10540' },
      { name: 'พระประแดง', postalCode: '10130' },
      { name: 'พระสมุทรเจดีย์', postalCode: '10290' },
      { name: 'บางเสาธง', postalCode: '10570' },
    ],
  },
  {
    name: 'สมุทรสาคร',
    districts: [
      { name: 'เมืองสมุทรสาคร', postalCode: '74000' },
      { name: 'กระทุ่มแบน', postalCode: '74110' },
      { name: 'บ้านแพ้ว', postalCode: '74120' },
    ],
  },
  {
    name: 'สมุทรสงคราม',
    districts: [
      { name: 'เมืองสมุทรสงคราม', postalCode: '75000' },
      { name: 'บางคนที', postalCode: '75120' },
      { name: 'อัมพวา', postalCode: '75110' },
    ],
  },
  {
    name: 'พระนครศรีอยุธยา',
    districts: [
      { name: 'พระนครศรีอยุธยา', postalCode: '13000' },
      { name: 'ท่าเรือ', postalCode: '13130' },
      { name: 'นครหลวง', postalCode: '13260' },
      { name: 'บางไทร', postalCode: '13190' },
      { name: 'บางบาล', postalCode: '13250' },
      { name: 'บางปะอิน', postalCode: '13160' },
      { name: 'บางปะหัน', postalCode: '13220' },
      { name: 'ผักไห่', postalCode: '13120' },
      { name: 'ภาชี', postalCode: '13140' },
      { name: 'ลาดบัวหลวง', postalCode: '13230' },
      { name: 'วังน้อย', postalCode: '13170' },
      { name: 'เสนา', postalCode: '13110' },
      { name: 'อุทัย', postalCode: '13210' },
    ],
  },
  {
    name: 'ชลบุรี',
    districts: [
      { name: 'เมืองชลบุรี', postalCode: '20000' },
      { name: 'บ้านบึง', postalCode: '20170' },
      { name: 'หนองใหญ่', postalCode: '20190' },
      { name: 'บางละมุง / พัทยา', postalCode: '20150' },
      { name: 'พานทอง', postalCode: '20160' },
      { name: 'พนัสนิคม', postalCode: '20140' },
      { name: 'ศรีราชา', postalCode: '20110' },
      { name: 'เกาะสีชัง', postalCode: '20120' },
      { name: 'สัตหีบ', postalCode: '20180' },
      { name: 'บ่อทอง', postalCode: '20270' },
      { name: 'เกาะจันทร์', postalCode: '20240' },
    ],
  },
  {
    name: 'ระยอง',
    districts: [
      { name: 'เมืองระยอง', postalCode: '21000' },
      { name: 'บ้านฉาง', postalCode: '21130' },
      { name: 'แกลง', postalCode: '21110' },
      { name: 'วังจันทร์', postalCode: '21210' },
      { name: 'บ้านค่าย', postalCode: '21120' },
      { name: 'ปลวกแดง', postalCode: '21140' },
      { name: 'เขาชะเมา', postalCode: '21110' },
      { name: 'นิคมพัฒนา', postalCode: '21180' },
    ],
  },
  {
    name: 'เชียงใหม่',
    districts: [
      { name: 'เมืองเชียงใหม่', postalCode: '50000' },
      { name: 'จอมทอง', postalCode: '50160' },
      { name: 'แม่แจ่ม', postalCode: '50270' },
      { name: 'เชียงดาว', postalCode: '50170' },
      { name: 'ดอยสะเก็ด', postalCode: '50220' },
      { name: 'แม่แตง', postalCode: '50150' },
      { name: 'แม่ริม', postalCode: '50180' },
      { name: 'สะเมิง', postalCode: '50250' },
      { name: 'ฝาง', postalCode: '50110' },
      { name: 'แม่อาย', postalCode: '50280' },
      { name: 'พร้าว', postalCode: '50190' },
      { name: 'สันป่าตอง', postalCode: '50120' },
      { name: 'สันกำแพง', postalCode: '50130' },
      { name: 'สันทราย', postalCode: '50210' },
      { name: 'หางดง', postalCode: '50230' },
      { name: 'ฮอด', postalCode: '50240' },
      { name: 'สารภี', postalCode: '50140' },
    ],
  },
  {
    name: 'เชียงราย',
    districts: [
      { name: 'เมืองเชียงราย', postalCode: '57000' },
      { name: 'แม่จัน', postalCode: '57110' },
      { name: 'แม่สาย', postalCode: '57130' },
      { name: 'เชียงแสน', postalCode: '57150' },
      { name: 'พาน', postalCode: '57120' },
      { name: 'เทิง', postalCode: '57160' },
      { name: 'แม่สรวย', postalCode: '57180' },
    ],
  },
  {
    name: 'ขอนแก่น',
    districts: [
      { name: 'เมืองขอนแก่น', postalCode: '40000' },
      { name: 'บ้านไผ่', postalCode: '40110' },
      { name: 'พล', postalCode: '40120' },
      { name: 'น้ำพอง', postalCode: '40140' },
      { name: 'ชุมแพ', postalCode: '40130' },
      { name: 'กระนวน', postalCode: '40170' },
      { name: 'บ้านฝาง', postalCode: '40270' },
    ],
  },
  {
    name: 'นครราชสีมา',
    districts: [
      { name: 'เมืองนครราชสีมา', postalCode: '30000' },
      { name: 'ปากช่อง', postalCode: '30130' },
      { name: 'สีคิ้ว', postalCode: '30140' },
      { name: 'พิมาย', postalCode: '30110' },
      { name: 'ปักธงชัย', postalCode: '30150' },
      { name: 'ด่านขุนทด', postalCode: '30210' },
      { name: 'โชคชัย', postalCode: '30190' },
    ],
  },
  {
    name: 'ภูเก็ต',
    districts: [
      { name: 'เมืองภูเก็ต', postalCode: '83000' },
      { name: 'กะทู้ (ป่าตอง)', postalCode: '83120' },
      { name: 'ถลาง', postalCode: '83110' },
    ],
  },
  {
    name: 'สงขลา',
    districts: [
      { name: 'เมืองสงขลา', postalCode: '90000' },
      { name: 'หาดใหญ่', postalCode: '90110' },
      { name: 'สะเดา', postalCode: '90120' },
      { name: 'จะนะ', postalCode: '90130' },
      { name: 'สิงหนคร', postalCode: '90280' },
      { name: 'นาหม่อม', postalCode: '90310' },
    ],
  },
  {
    name: 'สุราษฎร์ธานี',
    districts: [
      { name: 'เมืองสุราษฎร์ธานี', postalCode: '84000' },
      { name: 'เกาะสมุย', postalCode: '84140' },
      { name: 'เกาะพะงัน', postalCode: '84280' },
      { name: 'พุนพิน', postalCode: '84130' },
      { name: 'ดอนสัก', postalCode: '84220' },
      { name: 'เวียงสระ', postalCode: '84190' },
    ],
  },
  {
    name: 'นครปฐม',
    districts: [
      { name: 'เมืองนครปฐม', postalCode: '73000' },
      { name: 'กำแพงแสน', postalCode: '73140' },
      { name: 'นครชัยศรี', postalCode: '73120' },
      { name: 'ดอนตูม', postalCode: '73150' },
      { name: 'บางเลน', postalCode: '73130' },
      { name: 'สามพราน', postalCode: '73110' },
      { name: 'พุทธมณฑล', postalCode: '73170' },
    ],
  },
  {
    name: 'ฉะเชิงเทรา',
    districts: [
      { name: 'เมืองฉะเชิงเทรา', postalCode: '24000' },
      { name: 'บางคล้า', postalCode: '24110' },
      { name: 'บางน้ำเปรี้ยว', postalCode: '24150' },
      { name: 'บางปะกง', postalCode: '24130' },
      { name: 'บ้านโพธิ์', postalCode: '24140' },
      { name: 'พนมสารคาม', postalCode: '24120' },
      { name: 'แปลงยาว', postalCode: '24190' },
    ],
  },
  {
    name: 'จันทบุรี',
    districts: [
      { name: 'เมืองจันทบุรี', postalCode: '22000' },
      { name: 'ขลุง', postalCode: '22110' },
      { name: 'ท่าใหม่', postalCode: '22120' },
      { name: 'โป่งน้ำร้อน', postalCode: '22140' },
      { name: 'สอยดาว', postalCode: '22180' },
    ],
  },
  {
    name: 'สระบุรี',
    districts: [
      { name: 'เมืองสระบุรี', postalCode: '18000' },
      { name: 'แก่งคอย', postalCode: '18110' },
      { name: 'หนองแค', postalCode: '18140' },
      { name: 'วิหารแดง', postalCode: '18150' },
      { name: 'มวกเหล็ก', postalCode: '18180' },
    ],
  },
  {
    name: 'ลพบุรี',
    districts: [
      { name: 'เมืองลพบุรี', postalCode: '15000' },
      { name: 'พัฒนานิคม', postalCode: '15140' },
      { name: 'โคกสำโรง', postalCode: '15120' },
      { name: 'ชัยบาดาล', postalCode: '15130' },
      { name: 'ท่าวุ้ง', postalCode: '15150' },
      { name: 'บ้านหมี่', postalCode: '15110' },
    ],
  },
  {
    name: 'กาญจนบุรี',
    districts: [
      { name: 'เมืองกาญจนบุรี', postalCode: '71000' },
      { name: 'ไทรโยค', postalCode: '71150' },
      { name: 'บ่อพลอย', postalCode: '71160' },
      { name: 'ศรีสวัสดิ์', postalCode: '71250' },
      { name: 'ท่ามะกา', postalCode: '71120' },
      { name: 'ท่าม่วง', postalCode: '71110' },
      { name: 'ทองผาภูมิ', postalCode: '71180' },
    ],
  },
  {
    name: 'สุพรรณบุรี',
    districts: [
      { name: 'เมืองสุพรรณบุรี', postalCode: '72000' },
      { name: 'เดิมบางนางบวช', postalCode: '72120' },
      { name: 'ด่านช้าง', postalCode: '72180' },
      { name: 'บางปลาม้า', postalCode: '72150' },
      { name: 'ศรีประจันต์', postalCode: '72140' },
      { name: 'อู่ทอง', postalCode: '72160' },
    ],
  },
  {
    name: 'ราชบุรี',
    districts: [
      { name: 'เมืองราชบุรี', postalCode: '70000' },
      { name: 'จอมบึง', postalCode: '70150' },
      { name: 'ดำเนินสะดวก', postalCode: '70130' },
      { name: 'บ้านโป่ง', postalCode: '70110' },
      { name: 'โพธาราม', postalCode: '70120' },
      { name: 'สวนผึ้ง', postalCode: '70180' },
    ],
  },
  {
    name: 'เพชรบุรี',
    districts: [
      { name: 'เมืองเพชรบุรี', postalCode: '76000' },
      { name: 'เขาย้อย', postalCode: '76140' },
      { name: 'ชะอำ', postalCode: '76120' },
      { name: 'ท่ายาง', postalCode: '76130' },
      { name: 'บ้านลาด', postalCode: '76150' },
      { name: 'บ้านแหลม', postalCode: '76110' },
    ],
  },
  {
    name: 'ประจวบคีรีขันธ์',
    districts: [
      { name: 'เมืองประจวบคีรีขันธ์', postalCode: '77000' },
      { name: 'กุยบุรี', postalCode: '77150' },
      { name: 'ทับสะแก', postalCode: '77130' },
      { name: 'บางสะพาน', postalCode: '77140' },
      { name: 'ปราณบุรี', postalCode: '77120' },
      { name: 'หัวหิน', postalCode: '77110' },
    ],
  },
  {
    name: 'พิษณุโลก',
    districts: [
      { name: 'เมืองพิษณุโลก', postalCode: '65000' },
      { name: 'นครไทย', postalCode: '65120' },
      { name: 'บางระกำ', postalCode: '65140' },
      { name: 'บางกระทุ่ม', postalCode: '65150' },
      { name: 'วังทอง', postalCode: '65130' },
      { name: 'พรหมพิราม', postalCode: '65180' },
    ],
  },
  {
    name: 'นครสวรรค์',
    districts: [
      { name: 'เมืองนครสวรรค์', postalCode: '60000' },
      { name: 'โกรกพระ', postalCode: '60170' },
      { name: 'ชุมแสง', postalCode: '60120' },
      { name: 'หนองบัว', postalCode: '60110' },
      { name: 'บรรพตพิสัย', postalCode: '60180' },
      { name: 'เก้าเลี้ยว', postalCode: '60230' },
      { name: 'ตาคลี', postalCode: '60140' },
      { name: 'ท่าตะโก', postalCode: '60160' },
    ],
  },
  {
    name: 'อุดรธานี',
    districts: [
      { name: 'เมืองอุดรธานี', postalCode: '41000' },
      { name: 'กุดจับ', postalCode: '41250' },
      { name: 'หนองวัวซอ', postalCode: '41360' },
      { name: 'กุมภวาปี', postalCode: '41110' },
      { name: 'โนนสะอาด', postalCode: '41240' },
      { name: 'บ้านดุง', postalCode: '41190' },
      { name: 'เพ็ญ', postalCode: '41150' },
    ],
  },
  {
    name: 'อุบลราชธานี',
    districts: [
      { name: 'เมืองอุบลราชธานี', postalCode: '34000' },
      { name: 'ศรีเมืองใหม่', postalCode: '34250' },
      { name: 'โขงเจียม', postalCode: '34220' },
      { name: 'เขื่องใน', postalCode: '34150' },
      { name: 'เขมราฐ', postalCode: '34170' },
      { name: 'เดชอุดม', postalCode: '34160' },
      { name: 'วารินชำราบ', postalCode: '34190' },
    ],
  },
  {
    name: 'กระบี่',
    districts: [
      { name: 'เมืองกระบี่', postalCode: '81000' },
      { name: 'เกาะลันตา', postalCode: '81150' },
      { name: 'คลองท่อม', postalCode: '81120' },
      { name: 'อ่าวลึก', postalCode: '81110' },
    ],
  },
  {
    name: 'ตรัง',
    districts: [
      { name: 'เมืองตรัง', postalCode: '92000' },
      { name: 'กันตัง', postalCode: '92110' },
      { name: 'ห้วยยอด', postalCode: '92130' },
      { name: 'ย่านตาขาว', postalCode: '92140' },
    ],
  },
  {
    name: 'นครศรีธรรมราช',
    districts: [
      { name: 'เมืองนครศรีธรรมราช', postalCode: '80000' },
      { name: 'ทุ่งสง', postalCode: '80110' },
      { name: 'ท่าศาลา', postalCode: '80160' },
      { name: 'สิชล', postalCode: '80120' },
      { name: 'ขนอม', postalCode: '80210' },
      { name: 'ปากพนัง', postalCode: '80140' },
    ],
  },
  {
    name: 'ลำปาง',
    districts: [
      { name: 'เมืองลำปาง', postalCode: '52000' },
      { name: 'เกาะคา', postalCode: '52130' },
      { name: 'เถิน', postalCode: '52160' },
      { name: 'แม่เมาะ', postalCode: '52220' },
    ],
  },
  {
    name: 'ลำพูน',
    districts: [
      { name: 'เมืองลำพูน', postalCode: '51000' },
      { name: 'ป่าซาง', postalCode: '51120' },
      { name: 'บ้านโฮ่ง', postalCode: '51130' },
      { name: 'ลี้', postalCode: '51110' },
    ],
  },
  {
    name: 'น่าน',
    districts: [
      { name: 'เมืองน่าน', postalCode: '55000' },
      { name: 'ปัว', postalCode: '55120' },
      { name: 'เวียงสา', postalCode: '55110' },
    ],
  },
  {
    name: 'แพร่',
    districts: [
      { name: 'เมืองแพร่', postalCode: '54000' },
      { name: 'ร้องกวาง', postalCode: '54140' },
      { name: 'เด่นชัย', postalCode: '54110' },
      { name: 'สูงเม่น', postalCode: '54130' },
    ],
  },
  {
    name: 'ตาก',
    districts: [
      { name: 'เมืองตาก', postalCode: '63000' },
      { name: 'แม่สอด', postalCode: '63110' },
      { name: 'แม่ระมาด', postalCode: '63140' },
    ],
  },
  {
    name: 'สุโขทัย',
    districts: [
      { name: 'เมืองสุโขทัย', postalCode: '64000' },
      { name: 'สวรรคโลก', postalCode: '64110' },
      { name: 'ศรีสัชนาลัย', postalCode: '64130' },
    ],
  },
  {
    name: 'ตราด',
    districts: [
      { name: 'เมืองตราด', postalCode: '23000' },
      { name: 'คลองใหญ่', postalCode: '23110' },
      { name: 'เกาะช้าง', postalCode: '23170' },
      { name: 'เกาะกูด', postalCode: '23000' },
    ],
  },
  {
    name: 'ปราจีนบุรี',
    districts: [
      { name: 'เมืองปราจีนบุรี', postalCode: '25000' },
      { name: 'กบินทร์บุรี', postalCode: '25110' },
      { name: 'ศรีมหาโพธิ', postalCode: '25140' },
    ],
  },
  {
    name: 'สระแก้ว',
    districts: [
      { name: 'เมืองสระแก้ว', postalCode: '27000' },
      { name: 'อรัญประเทศ', postalCode: '27120' },
      { name: 'วัฒนานคร', postalCode: '27160' },
    ],
  },
  {
    name: 'นครนายก',
    districts: [
      { name: 'เมืองนครนายก', postalCode: '26000' },
      { name: 'บ้านนา', postalCode: '26110' },
      { name: 'องครักษ์', postalCode: '26120' },
      { name: 'ปากพลี', postalCode: '26130' },
    ],
  },
  {
    name: 'สิงห์บุรี',
    districts: [
      { name: 'เมืองสิงห์บุรี', postalCode: '16000' },
      { name: 'อินทร์บุรี', postalCode: '16110' },
      { name: 'บางระจัน', postalCode: '16130' },
    ],
  },
  {
    name: 'อ่างทอง',
    districts: [
      { name: 'เมืองอ่างทอง', postalCode: '14000' },
      { name: 'วิเศษชัยชาญ', postalCode: '14110' },
      { name: 'โพธิ์ทอง', postalCode: '14120' },
    ],
  },
  {
    name: 'ชัยนาท',
    districts: [
      { name: 'เมืองชัยนาท', postalCode: '17000' },
      { name: 'มโนรมย์', postalCode: '17110' },
      { name: 'วัดสิงห์', postalCode: '17120' },
      { name: 'สรรพยา', postalCode: '17150' },
    ],
  },
  {
    name: 'อุทัยธานี',
    districts: [
      { name: 'เมืองอุทัยธานี', postalCode: '61000' },
      { name: 'ทัพทัน', postalCode: '61120' },
      { name: 'หนองฉาง', postalCode: '61110' },
      { name: 'บ้านไร่', postalCode: '61140' },
    ],
  },
  {
    name: 'กำแพงเพชร',
    districts: [
      { name: 'เมืองกำแพงเพชร', postalCode: '62000' },
      { name: 'คลองขลุง', postalCode: '62120' },
      { name: 'พรานกระต่าย', postalCode: '62110' },
    ],
  },
  {
    name: 'พิจิตร',
    districts: [
      { name: 'เมืองพิจิตร', postalCode: '66000' },
      { name: 'ตะพานหิน', postalCode: '66110' },
      { name: 'บางมูลนาก', postalCode: '66120' },
    ],
  },
  {
    name: 'เพชรบูรณ์',
    districts: [
      { name: 'เมืองเพชรบูรณ์', postalCode: '67000' },
      { name: 'หล่มสัก', postalCode: '67110' },
      { name: 'เขาค้อ', postalCode: '67270' },
      { name: 'วิเชียรบุรี', postalCode: '67130' },
    ],
  },
  {
    name: 'ชัยภูมิ',
    districts: [
      { name: 'เมืองชัยภูมิ', postalCode: '36000' },
      { name: 'ภูเขียว', postalCode: '36110' },
      { name: 'แก้งคร้อ', postalCode: '36150' },
      { name: 'เกษตรสมบูรณ์', postalCode: '36120' },
    ],
  },
  {
    name: 'บุรีรัมย์',
    districts: [
      { name: 'เมืองบุรีรัมย์', postalCode: '31000' },
      { name: 'นางรอง', postalCode: '31110' },
      { name: 'ประโคนชัย', postalCode: '31140' },
      { name: 'สตึก', postalCode: '31150' },
    ],
  },
  {
    name: 'สุรินทร์',
    districts: [
      { name: 'เมืองสุรินทร์', postalCode: '32000' },
      { name: 'ปราสาท', postalCode: '32140' },
      { name: 'ศีขรภูมิ', postalCode: '32110' },
      { name: 'ท่าตูม', postalCode: '32120' },
    ],
  },
  {
    name: 'ศรีสะเกษ',
    districts: [
      { name: 'เมืองศรีสะเกษ', postalCode: '33000' },
      { name: 'กันทรลักษ์', postalCode: '33110' },
      { name: 'อุทุมพรพิสัย', postalCode: '33120' },
      { name: 'ราษีไศล', postalCode: '33160' },
    ],
  },
  {
    name: 'ร้อยเอ็ด',
    districts: [
      { name: 'เมืองร้อยเอ็ด', postalCode: '45000' },
      { name: 'โพนทอง', postalCode: '45110' },
      { name: 'เสลภูมิ', postalCode: '45120' },
      { name: 'สุวรรณภูมิ', postalCode: '45130' },
    ],
  },
  {
    name: 'มหาสารคาม',
    districts: [
      { name: 'เมืองมหาสารคาม', postalCode: '44000' },
      { name: 'กันทรวิชัย', postalCode: '44150' },
      { name: 'โกสุมพิสัย', postalCode: '44140' },
      { name: 'วาปีปทุม', postalCode: '44120' },
    ],
  },
  {
    name: 'กาฬสินธุ์',
    districts: [
      { name: 'เมืองกาฬสินธุ์', postalCode: '46000' },
      { name: 'ยางตลาด', postalCode: '46120' },
      { name: 'กมลาไสย', postalCode: '46130' },
      { name: 'สมเด็จ', postalCode: '46150' },
    ],
  },
  {
    name: 'สกลนคร',
    districts: [
      { name: 'เมืองสกลนคร', postalCode: '47000' },
      { name: 'สว่างแดนดิน', postalCode: '47110' },
      { name: 'พังโคน', postalCode: '47160' },
      { name: 'วานรนิวาส', postalCode: '47120' },
    ],
  },
  {
    name: 'นครพนม',
    districts: [
      { name: 'เมืองนครพนม', postalCode: '48000' },
      { name: 'ธาตุพนม', postalCode: '48110' },
      { name: 'ท่าอุเทน', postalCode: '48120' },
      { name: 'นาแก', postalCode: '48130' },
    ],
  },
  {
    name: 'มุกดาหาร',
    districts: [
      { name: 'เมืองมุกดาหาร', postalCode: '49000' },
      { name: 'นิคมคำสร้อย', postalCode: '49130' },
      { name: 'ดอนตาล', postalCode: '49120' },
    ],
  },
  {
    name: 'ยโสธร',
    districts: [
      { name: 'เมืองยโสธร', postalCode: '35000' },
      { name: 'เลิงนกทา', postalCode: '35120' },
      { name: 'คำเขื่อนแก้ว', postalCode: '35110' },
    ],
  },
  {
    name: 'อำนาจเจริญ',
    districts: [
      { name: 'เมืองอำนาจเจริญ', postalCode: '37000' },
      { name: 'ชานุมาน', postalCode: '37210' },
      { name: 'หัวตะพาน', postalCode: '37240' },
    ],
  },
  {
    name: 'บึงกาฬ',
    districts: [
      { name: 'เมืองบึงกาฬ', postalCode: '38000' },
      { name: 'เซกา', postalCode: '38150' },
      { name: 'โซ่พิสัย', postalCode: '38170' },
      { name: 'ปากคาด', postalCode: '38190' },
    ],
  },
  {
    name: 'หนองคาย',
    districts: [
      { name: 'เมืองหนองคาย', postalCode: '43000' },
      { name: 'ท่าบ่อ', postalCode: '43110' },
      { name: 'โพนพิสัย', postalCode: '43120' },
      { name: 'ศรีเชียงใหม่', postalCode: '43150' },
    ],
  },
  {
    name: 'เลย',
    districts: [
      { name: 'เมืองเลย', postalCode: '42000' },
      { name: 'เชียงคาน', postalCode: '42110' },
      { name: 'ด่านซ้าย', postalCode: '42120' },
      { name: 'วังสะพุง', postalCode: '42130' },
      { name: 'ภูกระดึง', postalCode: '42180' },
    ],
  },
  {
    name: 'หนองบัวลำภู',
    districts: [
      { name: 'เมืองหนองบัวลำภู', postalCode: '39000' },
      { name: 'ศรีบุญเรือง', postalCode: '39180' },
      { name: 'นากลาง', postalCode: '39170' },
    ],
  },
  {
    name: 'พะเยา',
    districts: [
      { name: 'เมืองพะเยา', postalCode: '56000' },
      { name: 'เชียงคำ', postalCode: '56110' },
      { name: 'ดอกคำใต้', postalCode: '56120' },
    ],
  },
  {
    name: 'แม่ฮ่องสอน',
    districts: [
      { name: 'เมืองแม่ฮ่องสอน', postalCode: '58000' },
      { name: 'ปาย', postalCode: '58130' },
      { name: 'แม่สะเรียง', postalCode: '58110' },
    ],
  },
  {
    name: 'ชุมพร',
    districts: [
      { name: 'เมืองชุมพร', postalCode: '86000' },
      { name: 'หลังสวน', postalCode: '86110' },
      { name: 'ท่าแซะ', postalCode: '86140' },
    ],
  },
  {
    name: 'ระนอง',
    districts: [
      { name: 'เมืองระนอง', postalCode: '85000' },
      { name: 'กระบุรี', postalCode: '85110' },
      { name: 'กะเปอร์', postalCode: '85120' },
    ],
  },
  {
    name: 'พังงา',
    districts: [
      { name: 'เมืองพังงา', postalCode: '82000' },
      { name: 'ตะกั่วป่า', postalCode: '82110' },
      { name: 'ท้ายเหมือง', postalCode: '82120' },
    ],
  },
  {
    name: 'พัทลุง',
    districts: [
      { name: 'เมืองพัทลุง', postalCode: '93000' },
      { name: 'ควนขนุน', postalCode: '93110' },
      { name: 'เขาชัยสน', postalCode: '93130' },
    ],
  },
  {
    name: 'สตูล',
    districts: [
      { name: 'เมืองสตูล', postalCode: '91000' },
      { name: 'ละงู', postalCode: '91110' },
      { name: 'ท่าแพ', postalCode: '91150' },
    ],
  },
  {
    name: 'ปัตตานี',
    districts: [
      { name: 'เมืองปัตตานี', postalCode: '94000' },
      { name: 'หนองจิก', postalCode: '94170' },
      { name: 'ยะหริ่ง', postalCode: '94150' },
      { name: 'สายบุรี', postalCode: '94110' },
    ],
  },
  {
    name: 'ยะลา',
    districts: [
      { name: 'เมืองยะลา', postalCode: '95000' },
      { name: 'เบตง', postalCode: '95110' },
      { name: 'รามัน', postalCode: '95140' },
    ],
  },
  {
    name: 'นราธิวาส',
    districts: [
      { name: 'เมืองนราธิวาส', postalCode: '96000' },
      { name: 'สุไหงโก-ลก', postalCode: '96120' },
      { name: 'ตากใบ', postalCode: '96110' },
      { name: 'ระแงะ', postalCode: '96130' },
    ],
  },
];

// Sort provinces and districts alphabetically according to Thai collation (ก-ฮ)
export const THAI_PROVINCES: ProvinceInfo[] = [...RAW_THAI_PROVINCES]
  .map((p) => ({
    ...p,
    districts: [...p.districts].sort((a, b) => a.name.localeCompare(b.name, 'th')),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'th'));

export const getDistrictsByProvince = (provinceName: string): DistrictInfo[] => {
  const found = THAI_PROVINCES.find((p) => p.name === provinceName);
  return found ? found.districts : [];
};

export const getPostalCode = (provinceName: string, districtName: string): string => {
  const districts = getDistrictsByProvince(provinceName);
  const district = districts.find((d) => d.name === districtName);
  return district ? district.postalCode : '';
};

