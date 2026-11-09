--
-- PostgreSQL database dump
--

\restrict nKkeyEHSVCRR99mPg5OyRZwRk99Wfgea8Gqretw9wkVpEVqS4ZLD95zduHKWAkl

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-09 08:56:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16583)
-- Name: account_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_balances (
    id integer NOT NULL,
    customer_id integer,
    prin_bal numeric(14,2),
    os_bal numeric(14,2),
    os_bal_cust numeric(14,2),
    ovd_amt numeric(14,2)
);


ALTER TABLE public.account_balances OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16582)
-- Name: account_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_balances_id_seq OWNER TO postgres;

--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 223
-- Name: account_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_balances_id_seq OWNED BY public.account_balances.id;


--
-- TOC entry 226 (class 1259 OID 16596)
-- Name: account_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_details (
    id integer NOT NULL,
    customer_id integer,
    oa_name character varying(30),
    open_date date,
    assign_date date,
    cr_limit numeric(14,2),
    dpd integer,
    max_bucket character varying(20),
    input_defdate date,
    queue character varying(30),
    round character varying(30),
    le_group character varying(30),
    lest character varying(30),
    tdr_flag character varying(10),
    tdr_date date,
    bt_eff_rate character varying(30),
    dlimt_amt character varying(30),
    tdr_code character varying(30),
    lead_group character varying(30),
    prod_desc character varying(100),
    int_notpod character varying(30),
    memo_accr character varying(30),
    remark character varying(50),
    chk_number character varying(30),
    grp_debt character varying(20),
    ao character varying(30),
    oa_id character varying(30),
    cycle character varying(30),
    flag_staff character varying(30),
    block character varying(10),
    strategy_code character varying(30),
    max_bucket_date date,
    bucket character varying(20),
    bucket_date date,
    grp_n character varying(30),
    lst_prch_dt date,
    type_debtre character varying(30),
    paycondition numeric(14,2),
    lst_cshadv_dt date,
    file_date date,
    prod_debt character varying(30),
    lst_pay_date date,
    status_flag character varying(30),
    lst_pay_amt numeric(14,2),
    olimit_amt character varying(30),
    strategy_npl character varying(30),
    start_lead_group date,
    instamt numeric(14,2),
    end_lead_group date
);


ALTER TABLE public.account_details OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16595)
-- Name: account_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_details_id_seq OWNER TO postgres;

--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 225
-- Name: account_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_details_id_seq OWNED BY public.account_details.id;


--
-- TOC entry 230 (class 1259 OID 16622)
-- Name: collection_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collection_notes (
    id integer NOT NULL,
    customer_id integer,
    action_code character varying(20),
    note_type character varying(20),
    telephone character varying(30),
    note text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.collection_notes OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16621)
-- Name: collection_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.collection_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.collection_notes_id_seq OWNER TO postgres;

--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 229
-- Name: collection_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.collection_notes_id_seq OWNED BY public.collection_notes.id;


--
-- TOC entry 234 (class 1259 OID 16688)
-- Name: collection_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collection_tasks (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    task_type character varying(30) DEFAULT 'Phone'::character varying NOT NULL,
    target_amount numeric(14,2) DEFAULT 0 NOT NULL,
    due_date date NOT NULL,
    priority character varying(20) DEFAULT 'Medium'::character varying NOT NULL,
    description text,
    status character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT collection_tasks_priority_check CHECK (((priority)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying])::text[]))),
    CONSTRAINT collection_tasks_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'In Progress'::character varying, 'Completed'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.collection_tasks OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16687)
-- Name: collection_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.collection_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.collection_tasks_id_seq OWNER TO postgres;

--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 233
-- Name: collection_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.collection_tasks_id_seq OWNED BY public.collection_tasks.id;


--
-- TOC entry 222 (class 1259 OID 16568)
-- Name: customer_phones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_phones (
    id integer NOT NULL,
    customer_id integer,
    label character varying(30) NOT NULL,
    number character varying(30) NOT NULL
);


ALTER TABLE public.customer_phones OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16567)
-- Name: customer_phones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_phones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_phones_id_seq OWNER TO postgres;

--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_phones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_phones_id_seq OWNED BY public.customer_phones.id;


--
-- TOC entry 220 (class 1259 OID 16552)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    cust_no character varying(20) NOT NULL,
    acct_mark character varying(30) NOT NULL,
    name character varying(150) NOT NULL,
    id_card character varying(20),
    birth_date date,
    occupation character varying(100),
    "position" character varying(100),
    address text,
    npl_pct numeric(5,2),
    stage integer,
    ar_no character varying(20),
    officer_name character varying(100),
    officer_phone character varying(30),
    created_at timestamp with time zone DEFAULT now(),
    status character varying(20) DEFAULT 'ACTIVE'::character varying
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16551)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 219
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 228 (class 1259 OID 16609)
-- Name: payment_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_info (
    id integer NOT NULL,
    customer_id integer,
    call_result character varying(50),
    due_date date,
    due_amount numeric(14,2),
    forecast_pct integer,
    debtor_type character varying(10),
    contact_date date,
    last_phone character varying(30),
    status_tag character varying(30)
);


ALTER TABLE public.payment_info OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16608)
-- Name: payment_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_info_id_seq OWNER TO postgres;

--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 227
-- Name: payment_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_info_id_seq OWNED BY public.payment_info.id;


--
-- TOC entry 236 (class 1259 OID 16719)
-- Name: payment_promises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_promises (
    id integer NOT NULL,
    task_id integer NOT NULL,
    promised_amount numeric(14,2) NOT NULL,
    promised_date date NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payment_promises_promised_amount_check CHECK ((promised_amount > (0)::numeric)),
    CONSTRAINT payment_promises_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Kept'::character varying, 'Broken'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.payment_promises OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16718)
-- Name: payment_promises_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_promises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_promises_id_seq OWNER TO postgres;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 235
-- Name: payment_promises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_promises_id_seq OWNED BY public.payment_promises.id;


--
-- TOC entry 232 (class 1259 OID 16646)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16645)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4900 (class 2604 OID 16586)
-- Name: account_balances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_balances ALTER COLUMN id SET DEFAULT nextval('public.account_balances_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16599)
-- Name: account_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_details ALTER COLUMN id SET DEFAULT nextval('public.account_details_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16625)
-- Name: collection_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_notes ALTER COLUMN id SET DEFAULT nextval('public.collection_notes_id_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 16691)
-- Name: collection_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_tasks ALTER COLUMN id SET DEFAULT nextval('public.collection_tasks_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16571)
-- Name: customer_phones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_phones ALTER COLUMN id SET DEFAULT nextval('public.customer_phones_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 16555)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16612)
-- Name: payment_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_info ALTER COLUMN id SET DEFAULT nextval('public.payment_info_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 16722)
-- Name: payment_promises id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_promises ALTER COLUMN id SET DEFAULT nextval('public.payment_promises_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16649)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5106 (class 0 OID 16583)
-- Dependencies: 224
-- Data for Name: account_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_balances (id, customer_id, prin_bal, os_bal, os_bal_cust, ovd_amt) FROM stdin;
5	1	17000.00	18500.00	18500.00	1500.00
6	2	12000.00	13500.00	13500.00	1500.00
7	3	29000.00	32750.00	32750.00	3750.00
8	4	6800.00	7200.00	7200.00	400.00
9	6	950000.00	1050000.00	1050000.00	100000.00
10	7	220000.00	250000.00	250000.00	30000.00
\.


--
-- TOC entry 5108 (class 0 OID 16596)
-- Dependencies: 226
-- Data for Name: account_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_details (id, customer_id, oa_name, open_date, assign_date, cr_limit, dpd, max_bucket, input_defdate, queue, round, le_group, lest, tdr_flag, tdr_date, bt_eff_rate, dlimt_amt, tdr_code, lead_group, prod_desc, int_notpod, memo_accr, remark, chk_number, grp_debt, ao, oa_id, cycle, flag_staff, block, strategy_code, max_bucket_date, bucket, bucket_date, grp_n, lst_prch_dt, type_debtre, paycondition, lst_cshadv_dt, file_date, prod_debt, lst_pay_date, status_flag, lst_pay_amt, olimit_amt, strategy_npl, start_lead_group, instamt, end_lead_group) FROM stdin;
5	1	OA001	2025-01-15	2026-08-01	50000.00	45	B2	\N	\N	\N	\N	\N	N	\N	\N	\N	\N	LG01	Personal Loan	\N	0	ทดสอบ	\N	GRP01	AO01	OA001	2	N	N	STR01	\N	B2	\N	G01	\N	PERSONAL	1.00	\N	\N	\N	\N	ACTIVE	2500.00	\N	\N	\N	2500.00	\N
6	2	OA002	2025-02-10	2026-08-02	60000.00	30	B1	\N	\N	\N	\N	\N	N	\N	\N	\N	\N	LG01	Credit Card	\N	0	ติดตามชำระ	\N	GRP02	AO02	OA002	2	N	N	STR02	\N	B1	\N	G02	\N	CREDIT	1.00	\N	\N	\N	\N	ACTIVE	1800.00	\N	\N	\N	1800.00	\N
7	3	OA003	2024-12-01	2026-08-03	80000.00	75	B3	\N	\N	\N	\N	\N	N	\N	\N	\N	\N	LG02	Personal Loan	\N	0	ติดตามเร่งด่วน	\N	GRP03	AO03	OA003	3	N	N	STR03	\N	B3	\N	G03	\N	PERSONAL	1.00	\N	\N	\N	\N	ACTIVE	3500.00	\N	\N	\N	3500.00	\N
8	4	OA004	2025-03-15	2026-08-04	40000.00	20	B1	2026-08-05	Q04	R01	LE01	L01	N	\N	12.50	40000	N	LG01	Personal Loan	N	0	ติดตามตามกำหนด	CHK004	GRP04	AO04	OA004	1	N	N	STR04	2026-08-05	B1	2026-08-05	G04	2026-07-20	PERSONAL	1.00	\N	2026-08-04	Personal Loan	2026-08-01	ACTIVE	1200.00	40000	STR04	2026-08-04	1200.00	2026-08-31
9	6	OA005	2023-05-15	2026-08-05	1500000.00	180	B5	2026-08-05	Q05	R01	LE05	L05	N	\N	15.00	1500000	N	LG05	Business Loan	N	0	ติดตามเร่งด่วน	CHK005	GRP05	AO05	OA005	5	N	N	STR05	2026-08-05	B5	2026-08-05	G05	2026-07-15	BUSINESS	1.00	\N	2026-08-05	Business Loan	2026-08-01	ACTIVE	25000.00	1500000	STR05	2026-08-05	25000.00	2026-08-31
11	7	OA006	2024-09-10	2026-08-06	300000.00	45	B2	2026-08-06	Q06	R01	LE06	L06	N	\N	10.50	300000	N	LG02	Personal Loan	N	0	ติดตามตามรอบ	CHK006	GRP06	AO06	OA006	2	N	N	STR06	2026-08-06	B2	2026-08-06	G06	2026-07-15	PERSONAL	1.00	\N	2026-08-06	Personal Loan	2026-07-01	ACTIVE	5000.00	300000	STR06	2026-08-06	5000.00	2026-08-31
\.


--
-- TOC entry 5112 (class 0 OID 16622)
-- Dependencies: 230
-- Data for Name: collection_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collection_notes (id, customer_id, action_code, note_type, telephone, note, created_at) FROM stdin;
13	7	NOA | OC	Office	2424	422442	2026-08-17 16:13:00+07
14	4	OC | NOA	Phone	0987878787	บายใจ	2026-08-19 09:26:00+07
6	2	NOA | NOA	NOTE	0812345200	ติดตามยอดค้างชำระกับลูกค้า	2026-08-17 16:05:00+07
5	2	OC | NOA	NOTE	0812345200	ลูกค้ารับสายและแจ้งว่าจะชำระภายในสัปดาห์นี้	2026-08-17 16:05:00+07
7	3	NOA | OC	NOTE	0812345300	แจ้งยอดค้างชำระให้ลูกค้าทราบ	2026-08-17 16:05:00+07
8	3	NOA | NOA	NOTE	0812345300	ลูกค้าขอเวลาตรวจสอบยอดก่อนชำระ	2026-08-17 16:05:00+07
3	1	NOA | OC	NOTE	0812345100	ลูกค้าแจ้งว่าจะชำระภายในวันที่ 20/08/2026	2026-08-17 16:03:00+07
4	1	NOA | OC	NOTE	0812345100	ติดต่อลูกค้าและแจ้งยอดค้างชำระ	2026-08-17 16:03:00+07
11	6	NOA | OC	NOTE	0812345600	ลูกหนี้แจ้งว่าขอเจรจาปรับโครงสร้างหนี้	2026-08-17 16:09:00+07
12	6	OC | OC	NOTE	0812345600	แจ้งยอดค้างชำระและนัดติดตามผล	2026-08-17 16:09:00+07
15	7	NOA | OC	Mobile	630538750272507	5757	2026-11-04 15:56:00+07
\.


--
-- TOC entry 5116 (class 0 OID 16688)
-- Dependencies: 234
-- Data for Name: collection_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collection_tasks (id, customer_id, task_type, target_amount, due_date, priority, description, status, created_at, updated_at) FROM stdin;
1	1	Phone	50000.00	2004-10-14	Low	ตามมานาน	Pending	2026-10-21 14:32:18.4234+07	2026-10-21 14:32:18.4234+07
2	2	Phone	41004040.00	2026-10-21	High	า่า่	Pending	2026-10-21 14:52:52.522358+07	2026-10-21 14:52:52.522358+07
3	8	Phone	50000.00	2026-10-21	Low	งสวสว	Pending	2026-10-21 14:53:20.112782+07	2026-10-21 14:53:20.112782+07
4	8	Phone	50000.00	2026-10-21	Medium	\N	Pending	2026-10-21 15:06:54.494749+07	2026-10-21 15:06:54.494749+07
5	8	Phone	50000.00	2026-10-21	Medium	ยย	Pending	2026-10-21 15:10:30.60882+07	2026-10-21 15:10:30.60882+07
6	8	Phone	50000.00	2026-10-21	Medium	4141	Pending	2026-10-21 15:13:07.873459+07	2026-10-21 15:13:07.873459+07
7	1	Phone	25000.00	2026-10-21	Medium	\N	Pending	2026-10-21 15:13:38.770032+07	2026-10-21 15:13:38.770032+07
8	8	Phone	411000.00	2026-11-04	Medium	SS	Pending	2026-11-04 13:44:05.97685+07	2026-11-04 13:44:05.97685+07
9	1	Phone	50000.00	2026-11-04	Medium	\N	Pending	2026-11-04 13:47:36.791626+07	2026-11-04 13:47:36.791626+07
10	10	Phone	100000.00	2026-11-04	High	5757	Pending	2026-11-04 13:48:26.798759+07	2026-11-04 13:48:26.798759+07
11	1	Mobile	500000.00	2026-11-04	Low	\N	Pending	2026-11-04 14:34:41.652304+07	2026-11-04 14:34:41.652304+07
12	9	Phone	50000.00	2026-11-04	Medium	\N	Pending	2026-11-04 14:35:19.359089+07	2026-11-04 14:35:19.359089+07
13	10	Office	717507507.00	2026-11-04	High	\N	Pending	2026-11-04 14:37:55.503653+07	2026-11-04 14:37:55.503653+07
14	7	Office	100000.00	2026-11-27	High	\N	Pending	2026-11-04 14:38:44.670492+07	2026-11-04 14:38:44.670492+07
\.


--
-- TOC entry 5104 (class 0 OID 16568)
-- Dependencies: 222
-- Data for Name: customer_phones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_phones (id, customer_id, label, number) FROM stdin;
9	1	Mobile	0812345100
10	1	Home	021234500
11	2	Mobile	0812345200
12	2	Home	021234520
13	3	Mobile	0812345300
14	3	Office	021234530
15	4	Mobile	0812345400
16	4	Office	021234540
17	6	Mobile	0812345600
18	6	Office	021234560
19	7	Mobile	0812345700
20	7	Office	053123570
\.


--
-- TOC entry 5102 (class 0 OID 16552)
-- Dependencies: 220
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, cust_no, acct_mark, name, id_card, birth_date, occupation, "position", address, npl_pct, stage, ar_no, officer_name, officer_phone, created_at, status) FROM stdin;
1	0000553353	626280XXXXXX5559	นายสัตว์ ดี	1103700123456	1990-05-15	พนักงานบริษัท	เจ้าหน้าที่	กรุงเทพมหานคร	15.50	1	AR00001	สมชาย เจ้าหน้าที่	0812345678	2026-08-17 15:57:02.450238+07	ACTIVE
2	0000553354	626280XXXXXX6660	นายจริงใจ ดีจ้า	1103700234567	1992-08-20	ธุรกิจส่วนตัว	เจ้าของกิจการ	เชียงใหม่	8.25	1	AR00002	สมชาย เจ้าหน้าที่	0812345678	2026-08-17 15:57:02.450238+07	INACTIVE
3	0000553355	626280XXXXXX7771	นายรักเเก หา	1103700345678	1988-11-10	ค้าขาย	เจ้าของร้าน	ชลบุรี	32.75	2	AR00003	วิชัย เจ้าหน้าที่	0898765432	2026-08-17 15:57:02.450238+07	SUSPENDED
4	0000553356	626280XXXXXX8882	นายรัชนนท์ เมย์	1103700456789	1995-02-28	พนักงานบริษัท	พนักงาน	นครปฐม	5.00	1	AR00004	วิชัย เจ้าหน้าที่	0898765432	2026-08-17 15:57:02.450238+07	CLOSED
6	0000553357	626280XXXXXX9999	นายจูลิวาน เมย์ช่า	1103700999999	1988-06-15	เจ้าของกิจการ	ผู้จัดการ	กรุงเทพมหานคร	75.00	3	AR000357	AO05	0812345500	2026-08-17 16:09:41.742641+07	WRITTEN_OFF
7	0000553358	626280XXXXXX1111	นางซ่าซ๋า จ้าช่า	1103700888888	1992-09-20	พนักงานบริษัท	หัวหน้างาน	เชียงใหม่	50.00	2	AR000358	AO06	0812345700	2026-08-17 16:11:32.683903+07	ACTIVE
8	tae	4545	422442	4224424242	2026-10-21	4224	4242	2424	20.00	244224	242442	424224	24424242	2026-10-21 14:40:25.293411+07	ACTIVE
9	527257257	57257527527	าส่	58757587	2026-10-21	85	558	85	50.00	57057	123456	424224	057057	2026-10-21 15:23:59.814174+07	ACTIVE
10	014014014	57257527527	าส่	58757587	2026-10-21	85	558	85	50.00	57057	123456	424224	057057	2026-10-21 15:26:57.670237+07	ACTIVE
\.


--
-- TOC entry 5110 (class 0 OID 16609)
-- Dependencies: 228
-- Data for Name: payment_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_info (id, customer_id, call_result, due_date, due_amount, forecast_pct, debtor_type, contact_date, last_phone, status_tag) FROM stdin;
5	2	ไม่รับสาย	2026-08-01	41000000.00	10	NPL	2026-08-21	0812345200	\N
3	1	ติดต่อไม่ได้	2026-08-11	1000.00	70	YPN	2026-08-17	0812345100	\N
11	6	ติดต่อไม่ได้	2026-07-27	25000.00	100	YPN	2026-08-12	06587635757	\N
7	3	ไม่รับสาย	2026-08-01	7000.00	40	Normal	2026-08-01	0812345300	\N
9	4	ไม่รับสาย	2026-07-25	1232.00	60	YPL	2026-08-10	0812345400	\N
13	7	ติดต่อไม่ได้	2026-12-02	1700000.00	50	YPN	2026-11-03	0988405158	\N
\.


--
-- TOC entry 5118 (class 0 OID 16719)
-- Dependencies: 236
-- Data for Name: payment_promises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_promises (id, task_id, promised_amount, promised_date, status, note, created_at) FROM stdin;
\.


--
-- TOC entry 5114 (class 0 OID 16646)
-- Dependencies: 232
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, full_name, role, created_at, phone) FROM stdin;
1	EMP12345	123456	เจ้าหน้าที่ K-Bank	admin	2026-08-17 13:35:47.914221	0812345678
2	tae	123456	ถิรวัฒน์ ณ ลำปาง	user	2026-08-17 15:24:33.814527	08575757575
\.


--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 223
-- Name: account_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_balances_id_seq', 10, true);


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 225
-- Name: account_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_details_id_seq', 11, true);


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 229
-- Name: collection_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.collection_notes_id_seq', 15, true);


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 233
-- Name: collection_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.collection_tasks_id_seq', 14, true);


--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_phones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_phones_id_seq', 20, true);


--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 219
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 10, true);


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 227
-- Name: payment_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_info_id_seq', 14, true);


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 235
-- Name: payment_promises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_promises_id_seq', 1, false);


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4929 (class 2606 OID 16589)
-- Name: account_balances account_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_balances
    ADD CONSTRAINT account_balances_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 16602)
-- Name: account_details account_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_details
    ADD CONSTRAINT account_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 16631)
-- Name: collection_notes collection_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_notes
    ADD CONSTRAINT collection_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4941 (class 2606 OID 16712)
-- Name: collection_tasks collection_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_tasks
    ADD CONSTRAINT collection_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 16576)
-- Name: customer_phones customer_phones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_phones
    ADD CONSTRAINT customer_phones_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 16566)
-- Name: customers customers_cust_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_cust_no_key UNIQUE (cust_no);


--
-- TOC entry 4925 (class 2606 OID 16564)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 16615)
-- Name: payment_info payment_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_info
    ADD CONSTRAINT payment_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4946 (class 2606 OID 16736)
-- Name: payment_promises payment_promises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_promises
    ADD CONSTRAINT payment_promises_pkey PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 16658)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4939 (class 2606 OID 16660)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4942 (class 1259 OID 16742)
-- Name: idx_collection_tasks_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collection_tasks_customer ON public.collection_tasks USING btree (customer_id);


--
-- TOC entry 4943 (class 1259 OID 16743)
-- Name: idx_collection_tasks_due_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collection_tasks_due_status ON public.collection_tasks USING btree (due_date, status);


--
-- TOC entry 4944 (class 1259 OID 16744)
-- Name: idx_payment_promises_task; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_promises_task ON public.payment_promises USING btree (task_id);


--
-- TOC entry 4948 (class 2606 OID 16590)
-- Name: account_balances account_balances_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_balances
    ADD CONSTRAINT account_balances_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 4949 (class 2606 OID 16603)
-- Name: account_details account_details_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_details
    ADD CONSTRAINT account_details_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 4951 (class 2606 OID 16632)
-- Name: collection_notes collection_notes_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_notes
    ADD CONSTRAINT collection_notes_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 4952 (class 2606 OID 16713)
-- Name: collection_tasks collection_tasks_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_tasks
    ADD CONSTRAINT collection_tasks_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4947 (class 2606 OID 16577)
-- Name: customer_phones customer_phones_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_phones
    ADD CONSTRAINT customer_phones_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 4950 (class 2606 OID 16616)
-- Name: payment_info payment_info_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_info
    ADD CONSTRAINT payment_info_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 4953 (class 2606 OID 16737)
-- Name: payment_promises payment_promises_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_promises
    ADD CONSTRAINT payment_promises_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.collection_tasks(id);


-- Completed on 2026-11-09 08:56:53

--
-- PostgreSQL database dump complete
--

\unrestrict nKkeyEHSVCRR99mPg5OyRZwRk99Wfgea8Gqretw9wkVpEVqS4ZLD95zduHKWAkl

