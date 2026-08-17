-- DebtCollect Pro — PostgreSQL schema

CREATE TABLE customers (
  id              SERIAL PRIMARY KEY,
  cust_no         VARCHAR(20)  NOT NULL UNIQUE,
  acct_mark       VARCHAR(30)  NOT NULL,
  name            VARCHAR(150) NOT NULL,
  id_card         VARCHAR(20),
  birth_date      DATE,
  occupation      VARCHAR(100),
  position        VARCHAR(100),
  address         TEXT,
  npl_pct         NUMERIC(5,2),
  stage           INT,
  ar_no           VARCHAR(20),
  officer_name    VARCHAR(100),
  officer_phone   VARCHAR(30),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customer_phones (
  id          SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
  label       VARCHAR(30) NOT NULL,   -- Phone1, Phone2, EBNPHONE1..4
  number      VARCHAR(30) NOT NULL
);

CREATE TABLE account_balances (
  id              SERIAL PRIMARY KEY,
  customer_id     INT REFERENCES customers(id) ON DELETE CASCADE,
  prin_bal        NUMERIC(14,2),
  os_bal          NUMERIC(14,2),
  os_bal_cust     NUMERIC(14,2),
  ovd_amt         NUMERIC(14,2)
);

CREATE TABLE account_details (
  id                 SERIAL PRIMARY KEY,
  customer_id        INT REFERENCES customers(id) ON DELETE CASCADE,
  oa_name            VARCHAR(30),
  memo_accr          VARCHAR(30),
  open_date          DATE,
  remark             VARCHAR(50),
  assign_date        DATE,
  cr_limit           NUMERIC(14,2),
  chk_number         VARCHAR(30),
  grp_debt           VARCHAR(20),
  dpd                INT,
  queue              VARCHAR(30),
  ao                 VARCHAR(30),
  oa_id              VARCHAR(30),
  cycle              VARCHAR(30),
  round              VARCHAR(30),
  le_group           VARCHAR(30),
  flag_staff         VARCHAR(30),
  block              VARCHAR(10),
  strategy_code      VARCHAR(30),
  max_bucket         VARCHAR(20),
  max_bucket_date    DATE,
  tdr_code           VARCHAR(30),
  bucket             VARCHAR(20),
  bucket_date        DATE,
  grp_n              VARCHAR(30),
  lst_prch_dt        DATE,
  tdr_date           DATE,
  type_debtre        VARCHAR(30),
  paycondition       NUMERIC(14,2),
  lst_cshadv_dt      DATE,
  file_date          DATE,
  bt_eff_rate        VARCHAR(30),
  prod_debt          VARCHAR(30),
  lst_pay_date       DATE,
  status_flag        VARCHAR(30),
  lead_group         VARCHAR(30),
  lst_pay_amt        NUMERIC(14,2),
  olimit_amt         VARCHAR(30),
  strategy_npl       VARCHAR(30),
  start_lead_group   DATE,
  instamt            NUMERIC(14,2),
  prod_desc          VARCHAR(100),
  end_lead_group     DATE,
  int_notpod         VARCHAR(30)
);

CREATE TABLE payment_info (
  id             SERIAL PRIMARY KEY,
  customer_id    INT REFERENCES customers(id) ON DELETE CASCADE,
  call_result    VARCHAR(50),
  due_date       DATE,
  due_amount     NUMERIC(14,2),
  forecast_pct   INT,
  debtor_type    VARCHAR(10),
  contact_date   DATE,
  last_phone     VARCHAR(30),
  status_tag     VARCHAR(30)
);

CREATE TABLE collection_notes (
  id             SERIAL PRIMARY KEY,
  customer_id    INT REFERENCES customers(id) ON DELETE CASCADE,
  action_code    VARCHAR(20),
  note_type      VARCHAR(20),
  telephone      VARCHAR(30),
  note           TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- seed example row matching the reference design
INSERT INTO customers (cust_no, acct_mark, name, id_card, birth_date, occupation, position, address, npl_pct, stage, ar_no, officer_name, officer_phone)
VALUES ('0000553349','626280XXXXXX1115','นาง อัญชลี มุ่งหมาย','3760100293512','1967-08-01','ข้าราชการ','อาจารย์ คศ.3',
'โรงเรียนหนองชุมแสงวิทยา 105/1 ม.1 ต.ท่าคอย อ.ท่ายาง จ.เพชรบุรี 76130',40,3,'ARK002','มุ่งหมาย','02-238-8800 ต่อ 203');

INSERT INTO customer_phones (customer_id, label, number)
SELECT id, label, number FROM customers, (VALUES
  ('Phone1','0615295291'), ('Phone2','032772333'),
  ('EBNPHONE1','0615295291'), ('EBNPHONE2','0615295291'),
  ('EBNPHONE3','0871592350'), ('EBNPHONE4','0615295291')
) AS p(label, number)
WHERE cust_no = '0000553349';

INSERT INTO account_balances (customer_id, prin_bal, os_bal, os_bal_cust, ovd_amt)
SELECT id, 55999.56, 63698.96, 63698.96, 3800.00 FROM customers WHERE cust_no = '0000553349';

INSERT INTO account_details (
  customer_id, oa_name, memo_accr, open_date, remark, assign_date, cr_limit, chk_number, grp_debt,
  dpd, queue, ao, oa_id, cycle, round, le_group, flag_staff, block, strategy_code,
  max_bucket, max_bucket_date, tdr_code, bucket, bucket_date, grp_n, lst_prch_dt, tdr_date,
  type_debtre, paycondition, lst_cshadv_dt, file_date, bt_eff_rate, prod_debt, lst_pay_date,
  status_flag, lead_group, lst_pay_amt, olimit_amt, strategy_npl, start_lead_group, instamt,
  prod_desc, end_lead_group, int_notpod
)
SELECT id, 'ARN', NULL, '2016-02-02', NULL, '2026-08-05', 95700.00, NULL, 'G2C',
  61, NULL, NULL, NULL, NULL, NULL, 'non-Legal', NULL, '0', NULL,
  '61-90', NULL, NULL, '61-90', NULL, NULL, NULL, '2024-03-28',
  '2) TDR', 1400.00, '2024-03-18', NULL, NULL, 'XPC', '2026-07-31',
  NULL, 'NPL ลด40%', 1500.00, NULL, 'NPL', '2569-07-01', 0.00,
  NULL, '2569-07-01', NULL
FROM customers WHERE cust_no = '0000553349';

INSERT INTO payment_info (customer_id, call_result, due_date, due_amount, forecast_pct, debtor_type, contact_date, last_phone, status_tag)
SELECT id, NULL, '2026-08-15', 1400.00, 100, 'YPN', NULL, '0871592350', 'Payment'
FROM customers WHERE cust_no = '0000553349';

INSERT INTO collection_notes (customer_id, action_code, note_type, telephone, note, created_at)
SELECT id, 'OC', 'Mobile', '0615295291',
  'ลูกค้ารับสายแจ้งยอดค้างเกินกำหนด ลูกค้ารับทราบ เจ้าหน้าที่แจ้งให้ลูกค้าชำระให้เกินวันที่ 15/08 ก่อน 1 งวด ยอด 1400 และแจ้งผลเสียลูกค้ารับทราบ // กนกวดี',
  '2026-08-06 11:37:13'
FROM customers WHERE cust_no = '0000553349';

INSERT INTO collection_notes (customer_id, action_code, note_type, telephone, note, created_at)
SELECT id, 'NOA | OC', 'Mobile', '0615295291', 'ไม่รับสาย // กนกวดี', '2026-08-10 16:31:35'
FROM customers WHERE cust_no = '0000553349';

INSERT INTO collection_notes (customer_id, action_code, note_type, telephone, note, created_at)
SELECT id, 'NOA | OC', 'Mobile', '0615295291', 'ไม่รับสาย // กนกวดี', '2026-08-14 12:17:21'
FROM customers WHERE cust_no = '0000553349';
