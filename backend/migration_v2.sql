-- Migration v2: run this on your EXISTING debtcollect database
-- (adds the extra account_details columns + fills in balances/details/payment/notes)

ALTER TABLE account_details ADD COLUMN IF NOT EXISTS memo_accr        VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS remark           VARCHAR(50);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS chk_number       VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS grp_debt         VARCHAR(20);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS ao               VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS oa_id            VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS cycle            VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS flag_staff       VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS block            VARCHAR(10);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS strategy_code    VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS max_bucket_date  DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS bucket           VARCHAR(20);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS bucket_date      DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS grp_n            VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS lst_prch_dt      DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS type_debtre      VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS paycondition     NUMERIC(14,2);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS lst_cshadv_dt    DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS file_date        DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS prod_debt        VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS lst_pay_date     DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS status_flag      VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS lst_pay_amt      NUMERIC(14,2);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS olimit_amt       VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS strategy_npl     VARCHAR(30);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS start_lead_group DATE;
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS instamt          NUMERIC(14,2);
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS end_lead_group   DATE;

-- clear out any partial rows for this demo customer, then reseed everything fresh
DELETE FROM collection_notes  WHERE customer_id IN (SELECT id FROM customers WHERE cust_no = '0000553349');
DELETE FROM payment_info      WHERE customer_id IN (SELECT id FROM customers WHERE cust_no = '0000553349');
DELETE FROM account_details   WHERE customer_id IN (SELECT id FROM customers WHERE cust_no = '0000553349');
DELETE FROM account_balances  WHERE customer_id IN (SELECT id FROM customers WHERE cust_no = '0000553349');
DELETE FROM customer_phones   WHERE customer_id IN (SELECT id FROM customers WHERE cust_no = '0000553349');

UPDATE customers SET
  name = 'นาง อัญชลี มุ่งหมาย',
  acct_mark = '626280XXXXXX1115',
  address = 'โรงเรียนหนองชุมแสงวิทยา 105/1 ม.1 ต.ท่าคอย อ.ท่ายาง จ.เพชรบุรี 76130',
  officer_name = 'มุ่งหมาย'
WHERE cust_no = '0000553349';

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
