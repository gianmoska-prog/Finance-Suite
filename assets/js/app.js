'use strict';

const APP_VERSION = '4.9';
const SCHEMA_VERSION = 2;
const STORAGE_KEY = 'moscatelliFinancialWorkstation.v31';
const LAST_SAVED_KEY = 'mfw_lastSavedDate';
const LAST_BACKUP_KEY = 'mfw_lastBackupDate';
let storageAvailable = true;
let pendingImportFile = null;

const translations = {
  en: {
    nav_threshold: 'Threshold', nav_calculator: 'Calculator', nav_academy: 'Academy', nav_assistant: 'Assistant',
    threshold_eyebrow: 'Moscatelli · Internal Financial Suite', threshold_title: 'Financial Workstation', threshold_subtitle: 'Numbers before ambition. No projection is doctrine until proven by quote, sample, and sale.', threshold_index: 'INDEX THRESHOLD', threshold_motto_title: 'Operational discipline before financial exposure.', threshold_motto_text: 'This workstation exists to force Moscatelli’s first product launch through the numbers: production, packaging, sell-through, cash drawdown, loan pressure, and documented proof.', threshold_enter: 'Enter Workstation', threshold_academy: 'Open Academy', index_scenario_sub: 'Current working model', index_cash_sub: 'Before revenue arrives', index_break_sub: 'Before loan repayment', index_loan_sub: 'Current scenario result', index_risk_status: 'Risk Status',
    calc_eyebrow: 'Moscatelli · First Product Launch', calc_title: 'Budget Calculator', calc_subtitle: 'A stricter local calculator for the Terra Bruna and Bianco Avorio scarf launch. It links batch size to production and packaging costs, models returns, defects, loan pressure, cash drawdown, inventory risk, and scenario sensitivity.',
    btn_print: 'Print / Save PDF', btn_export_csv: 'Export CSV', btn_reset: 'Reset', btn_cancel: 'Cancel', btn_confirm: 'Confirm',
    k_assumptionTitle: 'Assumption discipline.', k_assumptionText: 'All figures are provisional until replaced with real supplier quotes, physical samples, packaging tests, VAT/commercialista confirmation, and buyer commitments. This tool should punish optimism, not decorate it.',
    tax_notice_title: 'Tax exclusion.', tax_notice_text: 'Results are pre-income-tax, pre-INPS, pre-founder-withdrawal, and subject to commercialista confirmation.',
    k_cashDrawdown: 'Max Cash Drawdown', k_cashDrawdownSub: 'Cash needed before sales', k_landed: 'True Landed Cost / Unit', k_landedSub: 'Product + packaging + inbound', k_netRevenue: 'Net Revenue', k_netRevenueSub: 'After VAT mode, returns, fees', k_cashResult: 'Cash Result', k_cashResultSub: 'Before loan repayment', k_afterLoan: 'After Full Loan Repayment', k_breakEvenSell: 'Break-even Sell-through',
    tab_overview: 'Overview', tab_launch: 'Launch', tab_unit: 'Unit Economics', tab_fixed: 'Fixed Expenses', tab_loan: 'Loan & Capital', tab_risk: 'Risk', tab_comparison: 'Comparison', tab_archive: 'Archive',
    k_revenueInventory: 'Revenue & Inventory', k_revenueHint: 'Shows units sold, returned, defective, unsold inventory, and cash tied in packaging.', k_loanModel: 'Loan / Capital Model', k_loanHint: 'APR is modelled over time. A 12% rate over 6 months is not the same as 12% over 24 months.',
    k_launchAssumptions: 'Launch Assumptions', k_launchHint: 'Use presets, then refine manually. Under Regime Forfettario, sales VAT should normally be set to “No VAT Model”.', k_presets: 'Presets:', k_private30: 'Private 30', k_pilot50: 'Pilot 50', k_loan75: 'Loan 75', k_loan100: 'Loan 100',
    k_scenarioName: 'Scenario Name', k_status: 'Status', k_fiscalMode: 'Fiscal Mode', k_retailPrice: 'Retail Price', k_batchSize: 'Batch Size', k_sellThrough: 'Sell-through %', k_salesVat: 'Sales VAT %', k_retailVat: 'Retail Price VAT', k_paymentFee: 'Payment Fee %', k_fixedFee: 'Fixed Fee / Sale', k_shippingCharged: 'Shipping Charged / Sale',
    k_variable: 'Variable Unit Economics', k_variableHint: 'These costs scale with batch size, so revenue cannot rise while production stays frozen. This is the main correction from the AI audits.', k_prodCost: 'Production / Scarf', k_smallBatch: 'Small Batch Premium %', k_setupFee: 'Mill Setup Fee', k_dyeing: 'Dyeing Surcharge / Colour', k_colours: 'Colours', k_fringe: 'Fringe Finishing / Scarf', k_labelCost: 'Label + Care Tag / Scarf', k_inbound: 'Inbound Shipping Total', k_boxRule: 'Box Order Rule', k_packagingMoq: 'Packaging MOQ', k_boxesOrdered: 'Boxes Ordered', k_boxCost: 'Cost / Box', k_fulfilmentCost: 'Fulfilment Materials / Sale', k_outbound: 'Outbound Shipping / Sale', k_returnRate: 'Return Rate %', k_returnPenalty: 'Return/Repack Cost', k_defectRate: 'Defect Rate %', k_defectPenalty: 'Defect Handling / Unit', k_contingencyRate: 'Contingency %',
    k_fixedRegister: 'Fixed / One-off Expense Register', k_fixedHint: 'Use this for samples, photography, legal, website, travel, admin, and non-scaling costs. Product and packaging are now calculated above.', k_addExpense: 'Add Expense', k_item: 'Item', k_category: 'Category', k_priority: 'Priority', k_approvalGate: 'Approval Gate', k_qty: 'Qty', k_unitCost: 'Unit Cost', k_vat: 'VAT', k_vatRate: 'VAT %', k_notes: 'Notes', k_gate: 'Gate', k_unit: 'Unit', k_gross: 'Gross',
    k_loanAmount: 'Loan Amount', k_interest: 'Interest / APR %', k_loanTerm: 'Loan Term Months', k_bufferTarget: 'Cash Buffer Target %', k_riskDashboard: 'Risk Dashboard', k_riskHint: 'Red flags appear when assumptions are dangerous or structurally impossible.', k_sensitivity: 'Sensitivity', k_sensitivityHint: 'Current batch result at different sell-through levels.', k_keptSales: 'Kept Sales', k_batchComparison: 'Batch Comparison', k_batchHint: 'Compares 15, 30, 50, 75, and 100 units using the same cost assumptions.', k_batch: 'Batch', k_boxes: 'Boxes', k_breakEven: 'Break-even', k_afterLoanCurrent: 'After Loan @ Current Sell-through',
    k_backupTitle: 'Version Backup', k_backupHint: 'Save or reload a full dated JSON version. This preserves assumptions, expenses, documentation status, notes, loan settings, and scenario state.', k_saveBackup: 'Save Backup', k_loadBackup: 'Load Backup', k_noBackup: 'No backup loaded in this session.', k_backupFooter: 'Local browser storage remains enabled, but JSON backups are the safer record. Export a backup after any important change.', rail_title: 'Current Scenario',
    academy_title: 'Financial Academy', academy_subtitle: 'Internal training for understanding the workstation, launch economics, Italian fiscal assumptions, and the financial discipline required before production or debt.', assistant_title: 'Financial Assistant', assistant_subtitle: 'The AI layer can now connect to a Netlify Function. The API key remains on Netlify, never in this website.', assistant_status_title: 'Assistant status', assistant_status_hint: 'API calls are available only after you paste your Netlify Function URL. No API keys are stored in this website.', assistant_open: 'Open assistant panel', assistant_panel_title: 'MOSCATELLI FINANCIAL ASSISTANT', assistant_panel_status: 'Status: ready for Netlify endpoint. Paste the function URL below to request an AI review.', assistant_endpoint_label: 'Netlify Function URL', assistant_ask_ai: 'Ask AI for financial review', assistant_netlify_note: 'Use the Netlify Function endpoint from your separate Netlify deployment. The OpenAI key stays in Netlify environment variables.', assistant_ai_loading: 'Requesting financial review…', assistant_ai_missing_endpoint: 'Paste the Netlify Function URL first.', assistant_ai_error: 'AI review failed: {message}', assistant_copy: 'Copy scenario summary', assistant_export_json: 'Export scenario JSON', assistant_security: 'Never store API keys, bank data, tax codes, supplier contracts, or API secrets in client-side code or localStorage.', import_confirm_title: 'Load backup?', import_confirm_text: 'This will replace your current workstation state. Save a backup first if you need to preserve the current version.',
    status_draft: 'Draft', status_quote_based: 'Quote-based', status_sample_approved: 'Sample approved', status_approved: 'Approved', status_final: 'Final', table_swipe_hint: 'Swipe table horizontally if needed.',
    sub_repayment_over: '{amount} repayment over {months} months', sub_breakeven_detail: '{units} kept sales before loan · {loanUnits} with loan', sub_set_price: 'Set price to calculate', expenses_empty: 'No fixed expenses yet. Add costs above.',
    rev_batch: 'Batch size', rev_saleable: 'Saleable after defects', rev_initialSold: 'Initial sold', rev_returned: 'Returned/refunded', rev_keptSales: 'Kept sales', rev_unsold: 'Unsold units', rev_grossReceipts: 'Gross receipts kept', rev_outputVat: 'Output VAT shown', rev_paymentFees: 'Payment fees', rev_productCost: 'Product cost', rev_boxesOrdered: 'Boxes ordered', rev_packagingTied: 'Packaging cash tied in extras', rev_packagingShortage: 'Packaging shortage', rev_variableCosts: 'Variable costs', rev_fixedExpenses: 'Fixed expenses', rev_contingency: 'Contingency reserve', rev_initialRequired: 'Initial sales required after returns',
    loan_amount: 'Loan amount', loan_interest_cost: 'Interest / APR cost', loan_total_repayment: 'Total repayment', loan_breakeven_units: 'Break-even with loan', loan_breakeven_sellthrough: 'Sell-through needed with loan', loan_max_safe: 'Maximum safe loan from this batch', loan_buffer_recommended: 'Recommended cash buffer', loan_economic_after_interest: 'Economic result after interest only', loan_financed_cash_position: 'Financed cash position after repayment', loan_clarifier: 'Loan proceeds, operating profit, and repayment pressure are separate. This model shows conservative full-principal pressure as well as interest-only economics.',
    risk_structural: 'Structural viability', risk_loan_viability: 'Loan viability', risk_packaging_moq: 'Packaging MOQ', risk_packaging_shortage: 'Packaging shortage', risk_placeholders: 'Placeholders', risk_cash_drawdown: 'Cash drawdown', risk_vanity_spend: 'Vanity spend', risk_fiscal_mode: 'Fiscal mode', risk_tax_excluded: 'Tax excluded', risk_loan_ok: 'Needs {pct}% sell-through.', risk_loan_bad: 'Cannot repay from batch.', risk_pkg_ok: '{waste} extra boxes · {amount} tied.', risk_pkg_short_bad: '{shortage} scarves have no box allocated. Manual packaging quantity is below batch size.', risk_pkg_short_ok: 'Packaging quantity covers the batch.', risk_placeholders_text: '{count} fixed cost entries still placeholders.', risk_drawdown_text: '{amount} needed before sales.', risk_vanity_text: '{amount} marked vanity.', risk_forfettario_caution: 'Forfettario should normally use no sales VAT.', risk_fiscal_check: 'Check with commercialista.', risk_tax_text: 'Income tax, INPS, and founder withdrawals are excluded.', risk_structural_bad: 'Break-even exceeds 100% of saleable stock. The scenario is structurally negative.', risk_structural_ok: 'Break-even remains within saleable stock on current assumptions.',
    warn_structural: 'Structural warning: this batch cannot repay the loan and cover costs even at 100% sell-through.', warn_negative_loan: 'Warning: current scenario fails after full loan repayment.', warn_negative_cash: 'Warning: scenario is negative before loan. Treat this as proof spending, not commercial profit.', warn_positive: 'Scenario is positive on paper. Replace every placeholder with real quotes before trusting this result.', structural_banner_bad: 'STRUCTURAL WARNING — this scenario cannot cover costs and loan repayment even at full saleable sell-through.', structural_banner_cash_bad: 'CASH WARNING — this scenario is negative before any debt repayment.', structural_banner_ok: 'Current structure is viable on paper only. Replace placeholders with supplier quotes before trusting the result.',
    alert_copied: 'Scenario summary copied.', confirm_reset: 'Reset all entries and restore default assumptions?', import_corrected: 'Backup loaded with {count} corrected field(s).', import_loaded: 'Backup loaded: {file}', import_error: 'Could not load backup: {message}', backup_saved: 'Backup saved: {file}', delete_expense: 'Delete this expense?', delete_btn: 'Delete', physical_approval: 'Physical approval', no_value: '—'
  },
  it: {
    nav_threshold: 'Soglia', nav_calculator: 'Calcolatore', nav_academy: 'Accademia', nav_assistant: 'Assistente', threshold_title: 'Postazione Finanziaria', threshold_subtitle: 'Numeri prima dell’ambizione. Nessuna proiezione diventa dottrina finché non è provata da preventivo, campione e vendita.', threshold_enter: 'Entra nella postazione', threshold_academy: 'Apri Accademia', calc_title: 'Calcolatore Budget', academy_title: 'Accademia Finanziaria', assistant_title: 'Assistente Finanziario', btn_print: 'Stampa / Salva PDF', btn_export_csv: 'Esporta CSV', btn_reset: 'Reimposta', btn_cancel: 'Annulla', btn_confirm: 'Conferma', k_cashDrawdown: 'Fabbisogno massimo di cassa', k_landed: 'Costo reale unitario', k_netRevenue: 'Ricavo netto', k_cashResult: 'Risultato di cassa', k_afterLoan: 'Dopo rimborso completo prestito', k_breakEvenSell: 'Sell-through di pareggio', tab_overview: 'Sintesi', tab_launch: 'Lancio', tab_unit: 'Economia unitaria', tab_fixed: 'Costi fissi', tab_loan: 'Prestito e capitale', tab_risk: 'Rischio', tab_comparison: 'Confronto', tab_archive: 'Archivio', k_launchAssumptions: 'Ipotesi di lancio', k_variable: 'Economia variabile unitaria', k_fixedRegister: 'Registro costi fissi / una tantum', k_loanModel: 'Modello prestito / capitale', k_riskDashboard: 'Cruscotto rischi', k_sensitivity: 'Sensibilità', k_batchComparison: 'Confronto lotti', k_saveBackup: 'Salva backup', k_loadBackup: 'Carica backup', k_addExpense: 'Aggiungi costo', k_scenarioName: 'Nome scenario', k_status: 'Stato', k_fiscalMode: 'Regime fiscale', k_retailPrice: 'Prezzo retail', k_batchSize: 'Dimensione lotto', k_sellThrough: 'Sell-through %', k_paymentFee: 'Commissione pagamento %', k_loanAmount: 'Importo prestito', k_interest: 'Interesse / TAEG %', k_loanTerm: 'Durata prestito mesi', k_bufferTarget: 'Target riserva cassa %', k_item: 'Voce', k_category: 'Categoria', k_priority: 'Priorità', k_qty: 'Qtà', k_unitCost: 'Costo unitario', k_notes: 'Note', k_backupTitle: 'Backup versione', assistant_copy: 'Copia riepilogo scenario', assistant_export_json: 'Esporta JSON scenario', assistant_endpoint_label: 'URL della Function Netlify', assistant_ask_ai: 'Chiedi una revisione finanziaria all’AI', assistant_netlify_note: 'Usa l’endpoint della Function Netlify dal deployment separato. La chiave OpenAI resta nelle variabili ambiente di Netlify.', assistant_ai_loading: 'Richiesta di revisione finanziaria…', assistant_ai_missing_endpoint: 'Inserisci prima l’URL della Function Netlify.', assistant_ai_error: 'Revisione AI non riuscita: {message}', tax_notice_title: 'Esclusione fiscale.', tax_notice_text: 'I risultati sono al lordo di imposte sul reddito, INPS, prelievi del fondatore e soggetti a conferma del commercialista.', risk_tax_text: 'Imposte sul reddito, INPS e prelievi del fondatore sono esclusi.', alert_copied: 'Riepilogo scenario copiato.', confirm_reset: 'Reimpostare tutto e ripristinare le ipotesi predefinite?'
  },
  pt: {
    nav_threshold: 'Índice', nav_calculator: 'Calculadora', nav_academy: 'Academia', nav_assistant: 'Assistente', threshold_title: 'Estação Financeira', threshold_subtitle: 'Números antes da ambição. Nenhuma projeção vira doutrina antes de ser comprovada por orçamento, amostra e venda.', threshold_enter: 'Entrar na estação', threshold_academy: 'Abrir Academia', calc_title: 'Calculadora de Orçamento', academy_title: 'Academia Financeira', assistant_title: 'Assistente Financeiro', btn_print: 'Imprimir / Salvar PDF', btn_export_csv: 'Exportar CSV', btn_reset: 'Reiniciar', btn_cancel: 'Cancelar', btn_confirm: 'Confirmar', k_cashDrawdown: 'Necessidade máxima de caixa', k_landed: 'Custo real unitário', k_netRevenue: 'Receita líquida', k_cashResult: 'Resultado de caixa', k_afterLoan: 'Após quitação total do empréstimo', k_breakEvenSell: 'Sell-through de equilíbrio', tab_overview: 'Resumo', tab_launch: 'Lançamento', tab_unit: 'Economia unitária', tab_fixed: 'Custos fixos', tab_loan: 'Empréstimo e capital', tab_risk: 'Risco', tab_comparison: 'Comparação', tab_archive: 'Arquivo', k_launchAssumptions: 'Premissas de lançamento', k_variable: 'Economia variável unitária', k_fixedRegister: 'Registro de custos fixos / pontuais', k_loanModel: 'Modelo de empréstimo / capital', k_riskDashboard: 'Painel de riscos', k_sensitivity: 'Sensibilidade', k_batchComparison: 'Comparação de lotes', k_saveBackup: 'Salvar backup', k_loadBackup: 'Carregar backup', k_addExpense: 'Adicionar custo', k_scenarioName: 'Nome do cenário', k_status: 'Status', k_fiscalMode: 'Regime fiscal', k_retailPrice: 'Preço de venda', k_batchSize: 'Tamanho do lote', k_sellThrough: 'Sell-through %', k_paymentFee: 'Taxa de pagamento %', k_loanAmount: 'Valor do empréstimo', k_interest: 'Juros / taxa anual %', k_loanTerm: 'Prazo do empréstimo meses', k_bufferTarget: 'Meta de reserva de caixa %', k_item: 'Item', k_category: 'Categoria', k_priority: 'Prioridade', k_qty: 'Qtd', k_unitCost: 'Custo unitário', k_notes: 'Notas', k_backupTitle: 'Backup de versão', assistant_copy: 'Copiar resumo do cenário', assistant_export_json: 'Exportar JSON do cenário', assistant_endpoint_label: 'URL da Function Netlify', assistant_ask_ai: 'Pedir revisão financeira à IA', assistant_netlify_note: 'Use o endpoint da Function Netlify do deployment separado. A chave da OpenAI fica nas variáveis de ambiente da Netlify.', assistant_ai_loading: 'Solicitando revisão financeira…', assistant_ai_missing_endpoint: 'Insira primeiro a URL da Function Netlify.', assistant_ai_error: 'Falha na revisão por IA: {message}', tax_notice_title: 'Exclusão fiscal.', tax_notice_text: 'Os resultados não incluem imposto de renda, INPS, retiradas do fundador e dependem de confirmação contábil.', risk_tax_text: 'Imposto de renda, INPS e retiradas do fundador estão excluídos.', alert_copied: 'Resumo do cenário copiado.', confirm_reset: 'Reiniciar tudo e restaurar as premissas padrão?'
  }
};

// v4.6 — Academy beginner-proof operating manual patch.
Object.assign(translations.en, {
  "academy_eyebrow": "Moscatelli · Academy",
  "assistant_eyebrow": "Moscatelli · Future Layer",
  "opt_forfettario": "Regime Forfettario / No VAT sales",
  "opt_standard_vat": "Standard VAT registered",
  "opt_custom_no_vat": "Custom no-VAT model",
  "opt_no_vat_model": "No VAT Model",
  "opt_vat_included": "VAT Included",
  "opt_vat_excluded": "VAT Excluded",
  "opt_auto_packaging": "Auto: max batch/MOQ",
  "opt_manual_packaging": "Manual box quantity",
  "opt_needs_approval": "Needs physical approval",
  "opt_no_approval": "No approval gate",
  "opt_vat_none": "No VAT",
  "ph_scenario": "e.g. Bootstrap proof launch",
  "ph_item": "e.g. product photography, legal review",
  "ph_notes": "Supplier, quote status, risk, or deadline",
  "status_placeholder": "Placeholder",
  "status_quote_requested": "Quote requested",
  "status_quote_received": "Quote received",
  "status_paid": "Paid",
  "opt_samples": "Samples",
  "opt_photography": "Photography",
  "opt_website": "Website",
  "opt_legal_admin": "Legal / Admin",
  "opt_marketing": "Marketing",
  "opt_travel": "Travel",
  "opt_fulfilment": "Fulfilment",
  "opt_contingency": "Contingency",
  "opt_other": "Other",
  "opt_essential": "Essential",
  "opt_optional": "Optional",
  "opt_vanity": "Vanity",
  "rev_saleable_detail": "{saleable} ({defects} defects)",
  "rev_boxes_detail": "{boxes} ({extra} extra)",
  "loan_breakeven_units_detail": "{units} kept sales",
  "warn_shortfall": "shortfall.",
  "last_saved": "Last saved: {date}",
  "last_saved_never": "Last saved: not yet",
  "last_backup": "Last backup: {date}",
  "last_backup_never": "Last backup: not yet",
  "risk_high": "HIGH RISK",
  "risk_controlled_paper": "CONTROLLED ON PAPER",
  "risk_controlled": "CONTROLLED",
  "academy_mod_I": "How to use the workstation",
  "academy_mod_II": "Financial fundamentals",
  "academy_mod_III": "Luxury launch economics",
  "academy_mod_IV": "Moscatelli operating lessons",
  "academy_open_tab": "Open relevant calculator section →",
  "academy_l1_title": "How to read the executive summary",
  "academy_l1_text": "The top cards show the minimum numbers that matter: maximum cash drawdown, true landed cost, net revenue, cash result, debt pressure, and break-even sell-through. Read them before touching any aesthetic or marketing decision.",
  "academy_l2_title": "Scenario discipline: draft, quote-based, approved",
  "academy_l2_text": "A draft scenario is a hypothesis. Quote-based means supplier figures have replaced placeholders. Sample approved means the physical product has passed review. Do not treat these statuses as decoration.",
  "academy_l3_title": "Batch size and MOQ danger",
  "academy_l3_text": "Changing from 15 to 50 units changes production, packaging, risk, and cash drawdown. The tool links batch size to cost so the model cannot pretend revenue scales while expenses remain frozen.",
  "academy_l4_title": "True landed cost per unit",
  "academy_l4_text": "True landed cost includes production, setup, dyeing, labels, packaging, and inbound movement. It is not merely the mill’s production quote.",
  "academy_l5_title": "Sell-through versus kept sales",
  "academy_l5_text": "Initial sales are not the same as kept sales. Returns reduce the actual revenue base. This is why break-even now accounts for the return rate.",
  "academy_l6_title": "Returns and defects",
  "academy_l6_text": "Small losses matter brutally in a first batch. One defective scarf or one return can change the interpretation of a 15-unit launch.",
  "academy_l7_title": "Packaging economics",
  "academy_l7_text": "A packaging MOQ can tie up cash before sales. Manual box quantity below batch size now triggers a severe warning because every scarf needs presentation.",
  "academy_l8_title": "Essential, optional, vanity",
  "academy_l8_text": "Classify every fixed expense without sentimentality. Photography may be essential; excessive cinematic polish before proof may be vanity.",
  "academy_l9_title": "Debt, capital, and cash flow",
  "academy_l9_text": "Loan proceeds, operating profit, and repayment pressure are separate concepts. The model shows both conservative full-principal pressure and interest-only economics.",
  "academy_l10_title": "Regime Forfettario and tax exclusions",
  "academy_l10_text": "Under Forfettario, sales VAT should normally remain off in this model. The workstation does not calculate income tax, INPS, or founder withdrawals."
});
Object.assign(translations.it, {
  "threshold_eyebrow": "Moscatelli · Suite finanziaria interna",
  "threshold_index": "SOGLIA INDICE",
  "threshold_motto_title": "Disciplina operativa prima dell’esposizione finanziaria.",
  "threshold_motto_text": "Questa postazione obbliga il primo lancio prodotto Moscatelli a passare attraverso i numeri: produzione, packaging, sell-through, fabbisogno di cassa, pressione del prestito e prova documentata.",
  "index_scenario_sub": "Modello di lavoro corrente",
  "index_cash_sub": "Prima dell’arrivo dei ricavi",
  "index_break_sub": "Prima del rimborso del prestito",
  "index_loan_sub": "Risultato dello scenario corrente",
  "index_risk_status": "Stato del rischio",
  "calc_eyebrow": "Moscatelli · Primo lancio prodotto",
  "calc_subtitle": "Un calcolatore locale più severo per il lancio delle sciarpe Terra Bruna e Bianco Avorio. Collega la dimensione del lotto ai costi di produzione e packaging, modellando resi, difetti, pressione del prestito, fabbisogno di cassa, rischio inventario e sensibilità degli scenari.",
  "k_assumptionTitle": "Disciplina delle ipotesi.",
  "k_assumptionText": "Tutti i numeri sono provvisori finché non vengono sostituiti da preventivi reali, campioni fisici, test di packaging, conferma IVA/commercialista e impegni d’acquisto. Questo strumento deve punire l’ottimismo, non decorarlo.",
  "k_cashDrawdownSub": "Cassa necessaria prima delle vendite",
  "k_landedSub": "Prodotto + packaging + trasporto in ingresso",
  "k_netRevenueSub": "Dopo regime IVA, resi e commissioni",
  "k_cashResultSub": "Prima del rimborso del prestito",
  "k_revenueInventory": "Ricavi e inventario",
  "k_revenueHint": "Mostra unità vendute, rese, difettose, invendute e cassa immobilizzata nel packaging.",
  "k_loanHint": "Il TAEG è modellato nel tempo. Un tasso del 12% su 6 mesi non equivale a un 12% su 24 mesi.",
  "k_launchHint": "Usa i preset, poi rifinisci manualmente. In Regime Forfettario, l’IVA sulle vendite dovrebbe normalmente essere impostata su “Nessun modello IVA”.",
  "k_presets": "Preset:",
  "k_private30": "Privato 30",
  "k_pilot50": "Pilota 50",
  "k_loan75": "Prestito 75",
  "k_loan100": "Prestito 100",
  "k_salesVat": "IVA vendite %",
  "k_retailVat": "IVA prezzo retail",
  "k_fixedFee": "Commissione fissa / vendita",
  "k_shippingCharged": "Spedizione addebitata / vendita",
  "k_variableHint": "Questi costi scalano con il lotto, quindi i ricavi non possono crescere mentre la produzione resta congelata. È la correzione principale emersa dagli audit AI.",
  "k_prodCost": "Produzione / sciarpa",
  "k_smallBatch": "Premium piccolo lotto %",
  "k_setupFee": "Costo setup manifattura",
  "k_dyeing": "Sovrapprezzo tintura / colore",
  "k_colours": "Colori",
  "k_fringe": "Finitura frangia / sciarpa",
  "k_labelCost": "Etichetta + cura / sciarpa",
  "k_inbound": "Spedizione in ingresso totale",
  "k_boxRule": "Regola ordine scatole",
  "k_packagingMoq": "MOQ packaging",
  "k_boxesOrdered": "Scatole ordinate",
  "k_boxCost": "Costo / scatola",
  "k_fulfilmentCost": "Materiali evasione / vendita",
  "k_outbound": "Spedizione in uscita / vendita",
  "k_returnRate": "Tasso resi %",
  "k_returnPenalty": "Costo reso/repack",
  "k_defectRate": "Tasso difetti %",
  "k_defectPenalty": "Gestione difetto / unità",
  "k_contingencyRate": "Contingenza %",
  "k_fixedHint": "Usalo per campioni, fotografia, legale, sito, viaggi, amministrazione e costi non scalabili. Prodotto e packaging ora sono calcolati sopra.",
  "k_approvalGate": "Vincolo approvazione",
  "k_vat": "IVA",
  "k_vatRate": "IVA %",
  "k_gate": "Vincolo",
  "k_unit": "Unità",
  "k_gross": "Lordo",
  "k_riskHint": "Le bandiere rosse appaiono quando le ipotesi sono pericolose o strutturalmente impossibili.",
  "k_sensitivityHint": "Risultato del lotto attuale a diversi livelli di sell-through.",
  "k_keptSales": "Vendite mantenute",
  "k_batchHint": "Confronta 15, 30, 50, 75 e 100 unità usando le stesse ipotesi di costo.",
  "k_batch": "Lotto",
  "k_boxes": "Scatole",
  "k_breakEven": "Pareggio",
  "k_afterLoanCurrent": "Dopo prestito @ sell-through attuale",
  "k_backupHint": "Salva o ricarica una versione JSON completa e datata. Conserva ipotesi, costi, stato documentazione, note, impostazioni prestito e scenario.",
  "k_noBackup": "Nessun backup caricato in questa sessione.",
  "k_backupFooter": "Il salvataggio locale del browser resta attivo, ma i backup JSON sono il registro più sicuro. Esporta un backup dopo ogni modifica importante.",
  "rail_title": "Scenario corrente",
  "academy_eyebrow": "Moscatelli · Accademia",
  "academy_subtitle": "Formazione interna per comprendere la postazione, l’economia del lancio, le ipotesi fiscali italiane e la disciplina finanziaria necessaria prima della produzione o del debito.",
  "assistant_eyebrow": "Moscatelli · Livello futuro",
  "assistant_subtitle": "Il livello AI non è ancora collegato. Per ora usa l’assistente flottante per copiare un riepilogo strutturato dello scenario o esportare il backup JSON corrente.",
  "assistant_status_title": "Stato assistente",
  "assistant_status_hint": "Nessuna chiamata API è attiva. Nessuna chiave API è salvata in questo file.",
  "assistant_open": "Apri pannello assistente",
  "assistant_panel_title": "ASSISTENTE FINANZIARIO MOSCATELLI",
  "assistant_panel_status": "Stato: non collegato. Esporta lo scenario e incollalo in Claude, Grok, Gemini o ChatGPT per una revisione esterna.",
  "assistant_security": "Non salvare mai chiavi API, dati bancari, codici fiscali o contratti fornitori nel codice client-side o in localStorage.",
  "import_confirm_title": "Caricare il backup?",
  "import_confirm_text": "Questa azione sostituirà lo stato corrente della postazione. Salva prima un backup se devi conservare la versione attuale.",
  "status_draft": "Bozza",
  "status_quote_based": "Basato su preventivo",
  "status_sample_approved": "Campione approvato",
  "status_approved": "Approvato",
  "status_final": "Finale",
  "status_placeholder": "Segnaposto",
  "status_quote_requested": "Preventivo richiesto",
  "status_quote_received": "Preventivo ricevuto",
  "status_paid": "Pagato",
  "table_swipe_hint": "Scorri la tabella orizzontalmente se necessario.",
  "sub_repayment_over": "{amount} di rimborso in {months} mesi",
  "sub_breakeven_detail": "{units} vendite mantenute prima del prestito · {loanUnits} con prestito",
  "sub_set_price": "Imposta il prezzo per calcolare",
  "expenses_empty": "Nessun costo fisso inserito. Aggiungi i costi sopra.",
  "rev_batch": "Dimensione lotto",
  "rev_saleable": "Vendibili dopo difetti",
  "rev_saleable_detail": "{saleable} ({defects} difetti)",
  "rev_initialSold": "Vendute iniziali",
  "rev_returned": "Rese/rimborsate",
  "rev_keptSales": "Vendite mantenute",
  "rev_unsold": "Unità invendute",
  "rev_grossReceipts": "Incassi lordi mantenuti",
  "rev_outputVat": "IVA vendite mostrata",
  "rev_paymentFees": "Commissioni pagamento",
  "rev_productCost": "Costo prodotto",
  "rev_boxesOrdered": "Scatole ordinate",
  "rev_boxes_detail": "{boxes} ({extra} extra)",
  "rev_packagingTied": "Cassa immobilizzata in scatole extra",
  "rev_packagingShortage": "Scatole mancanti",
  "rev_variableCosts": "Costi variabili",
  "rev_fixedExpenses": "Costi fissi",
  "rev_contingency": "Riserva contingenza",
  "rev_initialRequired": "Vendite iniziali richieste dopo i resi",
  "loan_amount": "Importo prestito",
  "loan_interest_cost": "Costo interessi / TAEG",
  "loan_total_repayment": "Rimborso totale",
  "loan_breakeven_units": "Pareggio con prestito",
  "loan_breakeven_units_detail": "{units} vendite mantenute",
  "loan_breakeven_sellthrough": "Sell-through richiesto con prestito",
  "loan_max_safe": "Prestito massimo sicuro da questo lotto",
  "loan_buffer_recommended": "Riserva di cassa consigliata",
  "loan_economic_after_interest": "Risultato economico dopo soli interessi",
  "loan_financed_cash_position": "Posizione di cassa finanziata dopo rimborso",
  "loan_clarifier": "Proventi del prestito, utile operativo e pressione del rimborso sono concetti separati. Questo modello mostra sia la pressione conservativa del capitale intero sia l’economia dei soli interessi.",
  "risk_structural": "Tenuta strutturale",
  "risk_loan_viability": "Tenuta del prestito",
  "risk_packaging_moq": "MOQ packaging",
  "risk_packaging_shortage": "Scatole mancanti",
  "risk_placeholders": "Segnaposto",
  "risk_cash_drawdown": "Fabbisogno di cassa",
  "risk_vanity_spend": "Spesa di vanità",
  "risk_fiscal_mode": "Regime fiscale",
  "risk_tax_excluded": "Tasse escluse",
  "risk_loan_ok": "Richiede {pct}% di sell-through.",
  "risk_loan_bad": "Il lotto non può rimborsare il prestito.",
  "risk_pkg_ok": "{waste} scatole extra · {amount} immobilizzati.",
  "risk_pkg_short_bad": "{shortage} sciarpe non hanno scatola assegnata. La quantità manuale di packaging è inferiore al lotto.",
  "risk_pkg_short_ok": "La quantità di packaging copre il lotto.",
  "risk_placeholders_text": "{count} costi fissi sono ancora segnaposto.",
  "risk_drawdown_text": "{amount} necessari prima delle vendite.",
  "risk_vanity_text": "{amount} segnati come vanità.",
  "risk_forfettario_caution": "In Forfettario normalmente non si applica IVA sulle vendite.",
  "risk_fiscal_check": "Verificare con il commercialista.",
  "risk_structural_bad": "Il pareggio supera il 100% dello stock vendibile. Lo scenario è strutturalmente negativo.",
  "risk_structural_ok": "Il pareggio resta entro lo stock vendibile con le ipotesi attuali.",
  "warn_structural": "Avviso strutturale: questo lotto non può rimborsare il prestito e coprire i costi nemmeno con il 100% di sell-through vendibile.",
  "warn_negative_loan": "Avviso: lo scenario corrente fallisce dopo il rimborso completo del prestito.",
  "warn_shortfall": "scoperto.",
  "warn_negative_cash": "Avviso: lo scenario è negativo prima del prestito. Trattalo come spesa di prova, non come lancio commerciale.",
  "warn_positive": "Scenario positivo sulla carta. Sostituisci ogni segnaposto con preventivi reali prima di fidarti del risultato.",
  "structural_banner_bad": "AVVISO STRUTTURALE — questo scenario non copre costi e rimborso del prestito nemmeno con pieno sell-through vendibile.",
  "structural_banner_cash_bad": "AVVISO CASSA — questo scenario è negativo prima di qualsiasi rimborso del debito.",
  "structural_banner_ok": "Struttura sostenibile solo sulla carta. Sostituisci i segnaposto con preventivi fornitori prima di fidarti del risultato.",
  "import_corrected": "Backup caricato con {count} campo/i corretto/i.",
  "import_loaded": "Backup caricato: {file}",
  "import_error": "Impossibile caricare il backup: {message}",
  "backup_saved": "Backup salvato: {file}",
  "delete_expense": "Eliminare questo costo?",
  "delete_btn": "Elimina",
  "physical_approval": "Approvazione fisica",
  "no_value": "—",
  "last_saved": "Ultimo salvataggio: {date}",
  "last_saved_never": "Ultimo salvataggio: non ancora",
  "last_backup": "Ultimo backup: {date}",
  "last_backup_never": "Ultimo backup: non ancora",
  "risk_high": "RISCHIO ALTO",
  "risk_controlled_paper": "CONTROLLATO SULLA CARTA",
  "risk_controlled": "CONTROLLATO",
  "opt_forfettario": "Regime Forfettario / vendite senza IVA",
  "opt_standard_vat": "Regime IVA ordinario",
  "opt_custom_no_vat": "Modello personalizzato senza IVA",
  "opt_no_vat_model": "Nessun modello IVA",
  "opt_vat_included": "IVA inclusa",
  "opt_vat_excluded": "IVA esclusa",
  "opt_auto_packaging": "Auto: max lotto/MOQ",
  "opt_manual_packaging": "Quantità scatole manuale",
  "opt_samples": "Campioni",
  "opt_photography": "Fotografia",
  "opt_website": "Sito",
  "opt_legal_admin": "Legale / Admin",
  "opt_marketing": "Marketing",
  "opt_travel": "Viaggi",
  "opt_fulfilment": "Evasione",
  "opt_contingency": "Contingenza",
  "opt_other": "Altro",
  "opt_essential": "Essenziale",
  "opt_optional": "Opzionale",
  "opt_vanity": "Vanità",
  "opt_needs_approval": "Richiede approvazione fisica",
  "opt_no_approval": "Nessun vincolo approvazione",
  "opt_vat_none": "No IVA",
  "ph_scenario": "es. Lancio prova bootstrap",
  "ph_item": "es. fotografia prodotto, revisione legale",
  "ph_notes": "Fornitore, stato preventivo, rischio o scadenza",
  "academy_mod_I": "Come usare la postazione",
  "academy_mod_II": "Fondamenti finanziari",
  "academy_mod_III": "Economia del lancio luxury",
  "academy_mod_IV": "Lezioni operative Moscatelli",
  "academy_open_tab": "Apri sezione calcolatore pertinente →",
  "academy_l1_title": "Come leggere la sintesi esecutiva",
  "academy_l1_text": "Le carte superiori mostrano i numeri minimi che contano: fabbisogno massimo di cassa, costo reale unitario, ricavo netto, risultato di cassa, pressione del debito e sell-through di pareggio. Leggile prima di qualsiasi decisione estetica o marketing.",
  "academy_l2_title": "Disciplina dello scenario: bozza, preventivo, approvato",
  "academy_l2_text": "Uno scenario in bozza è un’ipotesi. “Basato su preventivo” significa che i numeri dei fornitori hanno sostituito i segnaposto. “Campione approvato” significa che il prodotto fisico ha superato la revisione. Non trattare questi stati come decorazione.",
  "academy_l3_title": "Dimensione lotto e pericolo MOQ",
  "academy_l3_text": "Passare da 15 a 50 unità cambia produzione, packaging, rischio e fabbisogno di cassa. Lo strumento collega il lotto al costo affinché il modello non possa fingere che i ricavi scalino mentre i costi restano fermi.",
  "academy_l4_title": "Costo reale unitario",
  "academy_l4_text": "Il costo reale unitario include produzione, setup, tintura, etichette, packaging e movimentazione in ingresso. Non è semplicemente il preventivo di produzione della manifattura.",
  "academy_l5_title": "Sell-through contro vendite mantenute",
  "academy_l5_text": "Le vendite iniziali non sono uguali alle vendite mantenute. I resi riducono la base reale di ricavo. Per questo il pareggio tiene conto del tasso di reso.",
  "academy_l6_title": "Resi e difetti",
  "academy_l6_text": "Piccole perdite pesano brutalmente in un primo lotto. Una sciarpa difettosa o un reso possono cambiare l’interpretazione di un lancio da 15 unità.",
  "academy_l7_title": "Economia del packaging",
  "academy_l7_text": "Un MOQ di packaging può immobilizzare cassa prima delle vendite. Una quantità manuale di scatole inferiore al lotto genera un avviso severo perché ogni sciarpa richiede presentazione.",
  "academy_l8_title": "Essenziale, opzionale, vanità",
  "academy_l8_text": "Classifica ogni costo fisso senza sentimentalismo. La fotografia può essere essenziale; un eccesso di polish cinematografico prima della prova può essere vanità.",
  "academy_l9_title": "Debito, capitale e flusso di cassa",
  "academy_l9_text": "Proventi del prestito, utile operativo e pressione del rimborso sono concetti separati. Il modello mostra sia la pressione conservativa del capitale intero sia l’economia dei soli interessi.",
  "academy_l10_title": "Regime Forfettario ed esclusioni fiscali",
  "academy_l10_text": "In Forfettario, l’IVA sulle vendite dovrebbe normalmente restare disattivata in questo modello. La postazione non calcola imposte sul reddito, INPS o prelievi del fondatore."
});
Object.assign(translations.pt, {
  "threshold_eyebrow": "Moscatelli · Suite financeira interna",
  "threshold_index": "ÍNDICE DE ENTRADA",
  "threshold_motto_title": "Disciplina operacional antes da exposição financeira.",
  "threshold_motto_text": "Esta estação obriga o primeiro lançamento de produto da Moscatelli a passar pelos números: produção, embalagem, sell-through, necessidade de caixa, pressão do empréstimo e prova documentada.",
  "index_scenario_sub": "Modelo de trabalho atual",
  "index_cash_sub": "Antes da entrada de receita",
  "index_break_sub": "Antes do pagamento do empréstimo",
  "index_loan_sub": "Resultado do cenário atual",
  "index_risk_status": "Status de risco",
  "calc_eyebrow": "Moscatelli · Primeiro lançamento de produto",
  "calc_subtitle": "Uma calculadora local mais rigorosa para o lançamento dos cachecóis Terra Bruna e Bianco Avorio. Ela liga o tamanho do lote aos custos de produção e embalagem, modelando devoluções, defeitos, pressão do empréstimo, necessidade de caixa, risco de estoque e sensibilidade dos cenários.",
  "k_assumptionTitle": "Disciplina das premissas.",
  "k_assumptionText": "Todos os números são provisórios até serem substituídos por orçamentos reais, amostras físicas, testes de embalagem, confirmação fiscal/contábil e compromissos de compra. Esta ferramenta deve punir o otimismo, não decorá-lo.",
  "k_cashDrawdownSub": "Caixa necessário antes das vendas",
  "k_landedSub": "Produto + embalagem + frete de entrada",
  "k_netRevenueSub": "Após regime fiscal, devoluções e taxas",
  "k_cashResultSub": "Antes do pagamento do empréstimo",
  "k_revenueInventory": "Receita e estoque",
  "k_revenueHint": "Mostra unidades vendidas, devolvidas, defeituosas, estoque parado e caixa preso em embalagem.",
  "k_loanHint": "A taxa anual é modelada ao longo do tempo. 12% em 6 meses não é o mesmo que 12% em 24 meses.",
  "k_launchHint": "Use os presets e depois ajuste manualmente. No Regime Forfettario, o IVA sobre vendas normalmente deve ser definido como “Sem modelo de IVA”.",
  "k_presets": "Presets:",
  "k_private30": "Privado 30",
  "k_pilot50": "Piloto 50",
  "k_loan75": "Empréstimo 75",
  "k_loan100": "Empréstimo 100",
  "k_salesVat": "IVA vendas %",
  "k_retailVat": "IVA no preço",
  "k_fixedFee": "Taxa fixa / venda",
  "k_shippingCharged": "Frete cobrado / venda",
  "k_variableHint": "Estes custos escalam com o tamanho do lote, portanto a receita não pode crescer enquanto a produção fica congelada. Esta é a principal correção dos audits de IA.",
  "k_prodCost": "Produção / cachecol",
  "k_smallBatch": "Premium lote pequeno %",
  "k_setupFee": "Taxa de setup da fábrica",
  "k_dyeing": "Sobretaxa de tingimento / cor",
  "k_colours": "Cores",
  "k_fringe": "Acabamento da franja / cachecol",
  "k_labelCost": "Etiqueta + cuidados / cachecol",
  "k_inbound": "Frete de entrada total",
  "k_boxRule": "Regra de pedido de caixas",
  "k_packagingMoq": "MOQ embalagem",
  "k_boxesOrdered": "Caixas pedidas",
  "k_boxCost": "Custo / caixa",
  "k_fulfilmentCost": "Materiais de envio / venda",
  "k_outbound": "Frete de saída / venda",
  "k_returnRate": "Taxa de devolução %",
  "k_returnPenalty": "Custo devolução/reembalagem",
  "k_defectRate": "Taxa de defeitos %",
  "k_defectPenalty": "Gestão de defeito / unidade",
  "k_contingencyRate": "Contingência %",
  "k_fixedHint": "Use isto para amostras, fotografia, jurídico, site, viagens, administração e custos que não escalam. Produto e embalagem agora são calculados acima.",
  "k_approvalGate": "Aprovação necessária",
  "k_vat": "IVA",
  "k_vatRate": "IVA %",
  "k_gate": "Gate",
  "k_unit": "Unid.",
  "k_gross": "Bruto",
  "k_riskHint": "Alertas vermelhos aparecem quando as premissas são perigosas ou estruturalmente impossíveis.",
  "k_sensitivityHint": "Resultado do lote atual em diferentes níveis de sell-through.",
  "k_keptSales": "Vendas mantidas",
  "k_batchHint": "Compara 15, 30, 50, 75 e 100 unidades usando as mesmas premissas de custo.",
  "k_batch": "Lote",
  "k_boxes": "Caixas",
  "k_breakEven": "Equilíbrio",
  "k_afterLoanCurrent": "Depois do empréstimo @ sell-through atual",
  "k_backupHint": "Salve ou recarregue uma versão JSON completa e datada. Preserva premissas, custos, status de documentação, notas, configurações de empréstimo e cenário.",
  "k_noBackup": "Nenhum backup carregado nesta sessão.",
  "k_backupFooter": "O salvamento local do navegador continua ativo, mas backups JSON são o registro mais seguro. Exporte um backup após qualquer mudança importante.",
  "rail_title": "Cenário atual",
  "academy_eyebrow": "Moscatelli · Academia",
  "academy_subtitle": "Treinamento interno para entender a estação, a economia do lançamento, as premissas fiscais italianas e a disciplina financeira exigida antes da produção ou do endividamento.",
  "assistant_eyebrow": "Moscatelli · Camada futura",
  "assistant_subtitle": "A camada de IA ainda não está conectada. Por enquanto, use o assistente flutuante para copiar um resumo estruturado do cenário ou exportar o backup JSON atual.",
  "assistant_status_title": "Status do assistente",
  "assistant_status_hint": "Nenhuma chamada de API está ativa. Nenhuma chave de API é armazenada neste arquivo.",
  "assistant_open": "Abrir painel do assistente",
  "assistant_panel_title": "ASSISTENTE FINANCEIRO MOSCATELLI",
  "assistant_panel_status": "Status: não conectado. Exporte seu cenário e cole no Claude, Grok, Gemini ou ChatGPT para revisão externa.",
  "assistant_security": "Nunca armazene chaves de API, dados bancários, códigos fiscais ou contratos de fornecedores em código client-side ou localStorage.",
  "import_confirm_title": "Carregar backup?",
  "import_confirm_text": "Isso substituirá o estado atual da estação. Salve um backup primeiro se precisar preservar a versão atual.",
  "status_draft": "Rascunho",
  "status_quote_based": "Baseado em orçamento",
  "status_sample_approved": "Amostra aprovada",
  "status_approved": "Aprovado",
  "status_final": "Final",
  "status_placeholder": "Placeholder",
  "status_quote_requested": "Orçamento solicitado",
  "status_quote_received": "Orçamento recebido",
  "status_paid": "Pago",
  "table_swipe_hint": "Deslize a tabela horizontalmente se necessário.",
  "sub_repayment_over": "{amount} de pagamento em {months} meses",
  "sub_breakeven_detail": "{units} vendas mantidas antes do empréstimo · {loanUnits} com empréstimo",
  "sub_set_price": "Defina o preço para calcular",
  "expenses_empty": "Nenhum custo fixo ainda. Adicione os custos acima.",
  "rev_batch": "Tamanho do lote",
  "rev_saleable": "Vendáveis após defeitos",
  "rev_saleable_detail": "{saleable} ({defects} defeitos)",
  "rev_initialSold": "Vendas iniciais",
  "rev_returned": "Devolvidas/reembolsadas",
  "rev_keptSales": "Vendas mantidas",
  "rev_unsold": "Unidades não vendidas",
  "rev_grossReceipts": "Recebimentos brutos mantidos",
  "rev_outputVat": "IVA de saída mostrado",
  "rev_paymentFees": "Taxas de pagamento",
  "rev_productCost": "Custo do produto",
  "rev_boxesOrdered": "Caixas pedidas",
  "rev_boxes_detail": "{boxes} ({extra} extras)",
  "rev_packagingTied": "Caixa preso em caixas extras",
  "rev_packagingShortage": "Falta de caixas",
  "rev_variableCosts": "Custos variáveis",
  "rev_fixedExpenses": "Custos fixos",
  "rev_contingency": "Reserva de contingência",
  "rev_initialRequired": "Vendas iniciais necessárias após devoluções",
  "loan_amount": "Valor do empréstimo",
  "loan_interest_cost": "Custo de juros / taxa anual",
  "loan_total_repayment": "Pagamento total",
  "loan_breakeven_units": "Equilíbrio com empréstimo",
  "loan_breakeven_units_detail": "{units} vendas mantidas",
  "loan_breakeven_sellthrough": "Sell-through necessário com empréstimo",
  "loan_max_safe": "Empréstimo máximo seguro deste lote",
  "loan_buffer_recommended": "Reserva de caixa recomendada",
  "loan_economic_after_interest": "Resultado econômico após apenas juros",
  "loan_financed_cash_position": "Posição de caixa financiada após pagamento",
  "loan_clarifier": "Recursos do empréstimo, lucro operacional e pressão de pagamento são conceitos separados. Este modelo mostra tanto a pressão prudente do principal completo quanto a economia apenas dos juros.",
  "risk_structural": "Viabilidade estrutural",
  "risk_loan_viability": "Viabilidade do empréstimo",
  "risk_packaging_moq": "MOQ embalagem",
  "risk_packaging_shortage": "Falta de caixas",
  "risk_placeholders": "Placeholders",
  "risk_cash_drawdown": "Necessidade de caixa",
  "risk_vanity_spend": "Gasto de vaidade",
  "risk_fiscal_mode": "Regime fiscal",
  "risk_tax_excluded": "Impostos excluídos",
  "risk_loan_ok": "Precisa de {pct}% de sell-through.",
  "risk_loan_bad": "Não é possível pagar o empréstimo com este lote.",
  "risk_pkg_ok": "{waste} caixas extras · {amount} presos.",
  "risk_pkg_short_bad": "{shortage} cachecóis não têm caixa alocada. A quantidade manual de embalagem está abaixo do lote.",
  "risk_pkg_short_ok": "A quantidade de embalagem cobre o lote.",
  "risk_placeholders_text": "{count} custos fixos ainda são placeholders.",
  "risk_drawdown_text": "{amount} necessários antes das vendas.",
  "risk_vanity_text": "{amount} marcados como vaidade.",
  "risk_forfettario_caution": "No Forfettario normalmente não se cobra IVA nas vendas.",
  "risk_fiscal_check": "Verificar com o contador/commercialista.",
  "risk_structural_bad": "O ponto de equilíbrio supera 100% do estoque vendável. O cenário é estruturalmente negativo.",
  "risk_structural_ok": "O ponto de equilíbrio permanece dentro do estoque vendável nas premissas atuais.",
  "warn_structural": "Aviso estrutural: este lote não consegue pagar o empréstimo e cobrir os custos mesmo com 100% de sell-through vendável.",
  "warn_negative_loan": "Aviso: o cenário atual falha após o pagamento completo do empréstimo.",
  "warn_shortfall": "de déficit.",
  "warn_negative_cash": "Aviso: o cenário é negativo antes do empréstimo. Trate isso como gasto de prova, não como lançamento comercial.",
  "warn_positive": "Cenário positivo no papel. Substitua todos os placeholders por orçamentos reais antes de confiar no resultado.",
  "structural_banner_bad": "AVISO ESTRUTURAL — este cenário não cobre custos e pagamento do empréstimo mesmo com sell-through vendável total.",
  "structural_banner_cash_bad": "AVISO DE CAIXA — este cenário é negativo antes de qualquer pagamento de dívida.",
  "structural_banner_ok": "Estrutura viável apenas no papel. Substitua placeholders por orçamentos de fornecedores antes de confiar no resultado.",
  "import_corrected": "Backup carregado com {count} campo(s) corrigido(s).",
  "import_loaded": "Backup carregado: {file}",
  "import_error": "Não foi possível carregar o backup: {message}",
  "backup_saved": "Backup salvo: {file}",
  "delete_expense": "Excluir este custo?",
  "delete_btn": "Excluir",
  "physical_approval": "Aprovação física",
  "no_value": "—",
  "last_saved": "Último salvamento: {date}",
  "last_saved_never": "Último salvamento: ainda não",
  "last_backup": "Último backup: {date}",
  "last_backup_never": "Último backup: ainda não",
  "risk_high": "RISCO ALTO",
  "risk_controlled_paper": "CONTROLADO NO PAPEL",
  "risk_controlled": "CONTROLADO",
  "opt_forfettario": "Regime Forfettario / vendas sem IVA",
  "opt_standard_vat": "Regime IVA padrão",
  "opt_custom_no_vat": "Modelo sem IVA personalizado",
  "opt_no_vat_model": "Sem modelo de IVA",
  "opt_vat_included": "IVA incluído",
  "opt_vat_excluded": "IVA excluído",
  "opt_auto_packaging": "Auto: máx. lote/MOQ",
  "opt_manual_packaging": "Quantidade manual de caixas",
  "opt_samples": "Amostras",
  "opt_photography": "Fotografia",
  "opt_website": "Site",
  "opt_legal_admin": "Jurídico / Admin",
  "opt_marketing": "Marketing",
  "opt_travel": "Viagem",
  "opt_fulfilment": "Envio",
  "opt_contingency": "Contingência",
  "opt_other": "Outro",
  "opt_essential": "Essencial",
  "opt_optional": "Opcional",
  "opt_vanity": "Vaidade",
  "opt_needs_approval": "Requer aprovação física",
  "opt_no_approval": "Sem aprovação necessária",
  "opt_vat_none": "Sem IVA",
  "ph_scenario": "ex. lançamento de prova bootstrap",
  "ph_item": "ex. fotografia de produto, revisão jurídica",
  "ph_notes": "Fornecedor, status do orçamento, risco ou prazo",
  "academy_mod_I": "Como usar a estação",
  "academy_mod_II": "Fundamentos financeiros",
  "academy_mod_III": "Economia de lançamento luxury",
  "academy_mod_IV": "Lições operacionais Moscatelli",
  "academy_open_tab": "Abrir seção relevante da calculadora →",
  "academy_l1_title": "Como ler o resumo executivo",
  "academy_l1_text": "Os cartões superiores mostram os números mínimos que importam: necessidade máxima de caixa, custo real unitário, receita líquida, resultado de caixa, pressão da dívida e sell-through de equilíbrio. Leia-os antes de qualquer decisão estética ou de marketing.",
  "academy_l2_title": "Disciplina do cenário: rascunho, orçamento, aprovado",
  "academy_l2_text": "Um cenário em rascunho é uma hipótese. “Baseado em orçamento” significa que números de fornecedores substituíram placeholders. “Amostra aprovada” significa que o produto físico passou pela revisão. Não trate esses status como decoração.",
  "academy_l3_title": "Tamanho do lote e perigo do MOQ",
  "academy_l3_text": "Mudar de 15 para 50 unidades altera produção, embalagem, risco e necessidade de caixa. A ferramenta liga lote a custo para que o modelo não finja que receita escala enquanto custos ficam congelados.",
  "academy_l4_title": "Custo real unitário",
  "academy_l4_text": "O custo real unitário inclui produção, setup, tingimento, etiquetas, embalagem e movimentação de entrada. Não é apenas o orçamento de produção da fábrica.",
  "academy_l5_title": "Sell-through versus vendas mantidas",
  "academy_l5_text": "Vendas iniciais não são iguais a vendas mantidas. Devoluções reduzem a base real de receita. Por isso o ponto de equilíbrio agora considera a taxa de devolução.",
  "academy_l6_title": "Devoluções e defeitos",
  "academy_l6_text": "Pequenas perdas pesam brutalmente em um primeiro lote. Um cachecol defeituoso ou uma devolução pode mudar a leitura de um lançamento de 15 unidades.",
  "academy_l7_title": "Economia da embalagem",
  "academy_l7_text": "Um MOQ de embalagem pode prender caixa antes das vendas. Quantidade manual de caixas abaixo do lote agora gera um alerta severo porque cada cachecol precisa de apresentação.",
  "academy_l8_title": "Essencial, opcional, vaidade",
  "academy_l8_text": "Classifique todo custo fixo sem sentimentalismo. Fotografia pode ser essencial; polimento cinematográfico excessivo antes da prova pode ser vaidade.",
  "academy_l9_title": "Dívida, capital e fluxo de caixa",
  "academy_l9_text": "Recursos do empréstimo, lucro operacional e pressão de pagamento são conceitos separados. O modelo mostra tanto a pressão prudente do principal inteiro quanto a economia apenas dos juros.",
  "academy_l10_title": "Regime Forfettario e exclusões fiscais",
  "academy_l10_text": "No Forfettario, o IVA sobre vendas normalmente deve permanecer desativado neste modelo. A estação não calcula imposto de renda, INPS ou retiradas do fundador."
});
Object.assign(translations.en, {"level_good": "GOOD", "level_warn": "WARN", "level_bad": "BAD"});
Object.assign(translations.it, {"level_good": "OK", "level_warn": "ATTENZIONE", "level_bad": "GRAVE"});
Object.assign(translations.pt, {"level_good": "OK", "level_warn": "ATENÇÃO", "level_bad": "GRAVE"});

Object.assign(translations.en, {
  k_currentPlan: 'Current Plan',
  alerts_title: 'Financial Alerts',
  alerts_subtitle: 'Warnings are grouped here to keep the index calm.',
  alerts_empty: 'No active warnings. Continue replacing assumptions with quotes.',
  alerts_index_sub: 'Open the bell menu for warnings.',
  alert_assumptions_title: 'Assumption discipline',
  alert_assumptions_text: 'All figures are provisional until replaced with real supplier quotes, physical samples, packaging tests, fiscal confirmation, and buyer commitments.',
  alert_tax_title: 'Tax exclusion',
  alert_tax_text: 'Results are pre-income-tax, pre-INPS, pre-founder-withdrawal, and subject to commercialista confirmation.',
  alert_structural_title: 'Structural viability',
  blank_scenario_name: 'Blank scenario'
});
Object.assign(translations.it, {
  k_currentPlan: 'Piano attuale',
  alerts_title: 'Avvisi finanziari',
  alerts_subtitle: 'Gli avvisi sono raccolti qui per mantenere l’indice pulito.',
  alerts_empty: 'Nessun avviso attivo. Continua a sostituire le ipotesi con preventivi.',
  alerts_index_sub: 'Apri il menu a campana per gli avvisi.',
  alert_assumptions_title: 'Disciplina delle ipotesi',
  alert_assumptions_text: 'Tutti i numeri sono provvisori finché non vengono sostituiti da preventivi reali, campioni fisici, test di packaging, conferma fiscale e impegni d’acquisto.',
  alert_tax_title: 'Esclusione fiscale',
  alert_tax_text: 'I risultati sono pre-imposte sul reddito, pre-INPS, pre-prelievo fondatore e soggetti a conferma del commercialista.',
  alert_structural_title: 'Validità strutturale',
  blank_scenario_name: 'Scenario vuoto'
});
Object.assign(translations.pt, {
  k_currentPlan: 'Plano atual',
  alerts_title: 'Alertas financeiros',
  alerts_subtitle: 'Os avisos ficam agrupados aqui para manter o índice limpo.',
  alerts_empty: 'Nenhum aviso ativo. Continue substituindo premissas por orçamentos reais.',
  alerts_index_sub: 'Abra o menu do sino para ver os avisos.',
  alert_assumptions_title: 'Disciplina das premissas',
  alert_assumptions_text: 'Todos os números são provisórios até serem substituídos por orçamentos reais, amostras físicas, testes de embalagem, confirmação fiscal e compromissos de compra.',
  alert_tax_title: 'Exclusão fiscal',
  alert_tax_text: 'Os resultados são antes de imposto de renda, contribuições sociais, retirada do fundador e sujeitos à confirmação contábil.',
  alert_structural_title: 'Viabilidade estrutural',
  blank_scenario_name: 'Cenário em branco'
});

const state = {
  uiLang: 'en',
  expenses: [],
  scenario: {
    scenarioName: 'Blank scenario',
    scenarioStatus: 'Draft',
    fiscalMode: 'forfettario',
    retailPrice: 0,
    batchSize: 0,
    sellThrough: 0,
    salesVatRate: 0,
    salesVatMode: 'none',
    paymentFee: 0,
    fixedFee: 0,
    shippingCharged: 0
  },
  variable: {
    productionUnitCost: 0,
    smallBatchPremium: 0,
    setupFee: 0,
    dyeingSurcharge: 0,
    colourCount: 1,
    fringeCost: 0,
    labelCost: 0,
    inboundShipping: 0,
    packagingMode: 'auto',
    packagingMoq: 0,
    boxesOrdered: 0,
    boxCost: 0,
    fulfilmentCost: 0,
    outboundShipping: 0,
    returnRate: 0,
    returnPenalty: 0,
    defectRate: 0,
    defectPenalty: 0,
    contingencyRate: 0
  },
  loan: {
    loanAmount: 0,
    interestRate: 0,
    loanTermMonths: 12,
    bufferTarget: 0
  }
};

const $ = id => document.getElementById(id);
const els = {
  languageSelect: $('languageSelect'), item: $('item'), category: $('category'), priority: $('priority'), status: $('status'), requiresApproval: $('requiresApproval'), qty: $('qty'), unitCost: $('unitCost'), vatMode: $('vatMode'), vatRateExpense: $('vatRateExpense'), notes: $('notes'), expenseRows: $('expenseRows'), addBtn: $('addBtn'), resetBtn: $('resetBtn'), exportBtn: $('exportBtn'), printBtn: $('printBtn'), saveBackupBtn: $('saveBackupBtn'), loadBackupBtn: $('loadBackupBtn'), backupFileInput: $('backupFileInput'), backupStatus: $('backupStatus'), lastSavedStatus: $('lastSavedStatus'), lastBackupStatus: $('lastBackupStatus'), cashDrawdown: $('cashDrawdown'), landedCost: $('landedCost'), netRevenue: $('netRevenue'), cashResult: $('cashResult'), afterLoan: $('afterLoan'), loanSub: $('loanSub'), breakEvenSellThrough: $('breakEvenSellThrough'), breakEvenSub: $('breakEvenSub'), revenueResults: $('revenueResults'), loanResults: $('loanResults'), loanWarning: $('loanWarning'), riskDashboard: $('riskDashboard'), sensitivityRows: $('sensitivityRows'), batchRows: $('batchRows'), railScenarioName: $('railScenarioName'), railNetRevenue: $('railNetRevenue'), railCashResult: $('railCashResult'), railAfterLoan: $('railAfterLoan'), railCashDrawdown: $('railCashDrawdown'), railBreakEven: $('railBreakEven'), railRiskBadge: $('railRiskBadge'), indexScenarioName: $('indexScenarioName'), indexCashDrawdown: $('indexCashDrawdown'), indexBreakEven: $('indexBreakEven'), indexAfterLoan: $('indexAfterLoan'), indexRiskStatus: $('indexRiskStatus'), indexRiskSub: $('indexRiskSub'), assistantFab: $('assistantFab'), assistantPanel: $('assistantPanel'), openAssistantPanel: $('openAssistantPanel'), closeAssistantPanel: $('closeAssistantPanel'), copyScenarioBtn: $('copyScenarioBtn'), assistantExportJsonBtn: $('assistantExportJsonBtn'), aiEndpointUrl: $('aiEndpointUrl'), askAiBtn: $('askAiBtn'), aiResponse: $('aiResponse'), aiStatusLine: $('aiStatusLine'), importConfirmModal: $('importConfirmModal'), cancelImportBtn: $('cancelImportBtn'), confirmImportBtn: $('confirmImportBtn'), structuralBanner: $('structuralBanner'), alertsToggle: $('alertsToggle'), alertsMenu: $('alertsMenu'), alertsCount: $('alertsCount'), alertsList: $('alertsList'), printHeader: $('printHeader'), salesVatRate: $('salesVatRate'), salesVatMode: $('salesVatMode')
};

const scenarioIds = ['scenarioName', 'scenarioStatus', 'fiscalMode', 'retailPrice', 'batchSize', 'sellThrough', 'salesVatRate', 'salesVatMode', 'paymentFee', 'fixedFee', 'shippingCharged'];
const variableIds = ['productionUnitCost', 'smallBatchPremium', 'setupFee', 'dyeingSurcharge', 'colourCount', 'fringeCost', 'labelCost', 'inboundShipping', 'packagingMode', 'packagingMoq', 'boxesOrdered', 'boxCost', 'fulfilmentCost', 'outboundShipping', 'returnRate', 'returnPenalty', 'defectRate', 'defectPenalty', 'contingencyRate'];
const loanIds = ['loanAmount', 'interestRate', 'loanTermMonths', 'bufferTarget'];
const validRoutes = ['threshold', 'calculator', 'academy', 'assistant'];

function t(key) {
  return (translations[state.uiLang] && translations[state.uiLang][key]) || translations.en[key] || key;
}

function tmpl(key, vars) {
  let s = t(key);
  Object.entries(vars || {}).forEach(([k, v]) => {
    s = s.replaceAll(`{${k}}`, String(v));
  });
  return s;
}

const valueTranslationKeys = {
  'Samples': 'opt_samples',
  'Photography': 'opt_photography',
  'Website': 'opt_website',
  'Legal / Admin': 'opt_legal_admin',
  'Marketing': 'opt_marketing',
  'Travel': 'opt_travel',
  'Fulfilment': 'opt_fulfilment',
  'Contingency': 'opt_contingency',
  'Other': 'opt_other',
  'Essential': 'opt_essential',
  'Optional': 'opt_optional',
  'Vanity': 'opt_vanity',
  'Placeholder': 'status_placeholder',
  'Quote requested': 'status_quote_requested',
  'Quote received': 'status_quote_received',
  'Quote-based': 'status_quote_based',
  'Sample approved': 'status_sample_approved',
  'Approved': 'status_approved',
  'Paid': 'status_paid',
  'Draft': 'status_draft',
  'Final': 'status_final'
};

function labelForValue(value) {
  return valueTranslationKeys[value] ? t(valueTranslationKeys[value]) : value;
}

function applyLanguage() {
  document.documentElement.lang = state.uiLang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
  if (els.languageSelect) els.languageSelect.value = state.uiLang;
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function eur(value, digits = 0) {
  return (Number.isFinite(value) ? value : 0).toLocaleString('en-IE', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: digits, maximumFractionDigits: digits
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function csv(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function stamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

function canUseStorage() {
  try {
    const k = '__mfw_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    storageAvailable = true;
    return true;
  } catch {
    storageAvailable = false;
    return false;
  }
}

function expenseMath(expense) {
  const qty = Math.max(0, num(expense.qty));
  const unit = Math.max(0, num(expense.unitCost));
  const rate = Math.max(0, num(expense.vatRate));
  const base = qty * unit;

  if (expense.vatMode === 'included') {
    const net = rate ? base / (1 + rate / 100) : base;
    return { gross: base, net, vat: base - net };
  }
  if (expense.vatMode === 'excluded') {
    const vat = base * rate / 100;
    return { gross: base + vat, net: base, vat };
  }
  return { gross: base, net: base, vat: 0 };
}

function expenseTotals() {
  return state.expenses.reduce((acc, exp) => {
    const m = expenseMath(exp);
    acc.gross += m.gross;
    acc.net += m.net;
    acc.vat += m.vat;
    if (exp.status === 'Placeholder') acc.placeholders += 1;
    if (exp.priority === 'Essential') acc.essential += m.gross;
    if (exp.priority === 'Vanity') acc.vanity += m.gross;
    return acc;
  }, { gross: 0, net: 0, vat: 0, placeholders: 0, essential: 0, vanity: 0 });
}

function autoBoxes(batch, variable) {
  return variable.packagingMode === 'auto'
    ? Math.max(Math.ceil(num(variable.packagingMoq)), Math.ceil(batch))
    : Math.ceil(Math.max(0, num(variable.boxesOrdered)));
}

function calc(overrides = {}) {
  const s = { ...state.scenario, ...(overrides.scenario || {}) };
  const v = { ...state.variable, ...(overrides.variable || {}) };
  const l = { ...state.loan, ...(overrides.loan || {}) };
  const fixed = expenseTotals();

  const batch = Math.max(0, Math.floor(num(s.batchSize)));
  const sell = clamp(num(s.sellThrough), 0, 100);
  const defectRate = clamp(num(v.defectRate), 0, 100);
  const returnRate = clamp(num(v.returnRate), 0, 100);
  const defectUnits = Math.ceil(batch * defectRate / 100);
  const saleableUnits = Math.max(0, batch - defectUnits);
  const initialSold = Math.min(saleableUnits, Math.floor(saleableUnits * sell / 100));
  const returnedUnits = Math.ceil(initialSold * returnRate / 100);
  const keptSales = Math.max(0, initialSold - returnedUnits);
  const unsoldUnits = Math.max(0, saleableUnits - initialSold + returnedUnits);

  const retail = Math.max(0, num(s.retailPrice));
  const shipCharged = Math.max(0, num(s.shippingCharged));
  const grossReceipts = keptSales * (retail + shipCharged);
  const salesVatRate = Math.max(0, num(s.salesVatRate));
  let outputVat = 0;
  let netReceipts = grossReceipts;
  if (s.salesVatMode === 'included' && salesVatRate > 0) {
    netReceipts = grossReceipts / (1 + salesVatRate / 100);
    outputVat = grossReceipts - netReceipts;
  } else if (s.salesVatMode === 'excluded' && salesVatRate > 0) {
    outputVat = grossReceipts * salesVatRate / 100;
  }

  const paymentFees = initialSold * (retail + shipCharged) * Math.max(0, num(s.paymentFee)) / 100 + initialSold * Math.max(0, num(s.fixedFee));
  const netRevenue = netReceipts - paymentFees;
  const productionPerUnit = batch > 0 ? (num(v.productionUnitCost) * (1 + num(v.smallBatchPremium) / 100) + num(v.fringeCost) + num(v.labelCost)) : 0;
  const productCost = batch * productionPerUnit + num(v.setupFee) + num(v.dyeingSurcharge) * Math.max(1, num(v.colourCount));
  const boxes = autoBoxes(batch, v);
  const packagingCost = boxes * num(v.boxCost);
  const fulfilmentCost = initialSold * (num(v.fulfilmentCost) + num(v.outboundShipping));
  const returnsCost = returnedUnits * num(v.returnPenalty);
  const defectsCost = defectUnits * num(v.defectPenalty);
  const variableCost = productCost + packagingCost + num(v.inboundShipping) + fulfilmentCost + returnsCost + defectsCost;
  const preContingency = fixed.gross + variableCost;
  const contingency = preContingency * num(v.contingencyRate) / 100;
  const totalCashCosts = preContingency + contingency;
  const cashDrawdown = totalCashCosts;
  const cashResult = netRevenue - totalCashCosts;

  const loanAmount = Math.max(0, num(l.loanAmount));
  const interest = loanAmount * num(l.interestRate) / 100 * (Math.max(1, num(l.loanTermMonths)) / 12);
  const loanRepayment = loanAmount + interest;
  const afterLoan = cashResult - loanRepayment;
  const economicResultAfterInterest = cashResult - interest;
  const financedCashPosition = loanAmount - cashDrawdown + netRevenue - loanRepayment;

  const landedCostPerUnit = batch ? (productCost + packagingCost + num(v.inboundShipping)) / batch : 0;
  const netPerKeptSale = retail + shipCharged > 0 ? (() => {
    let r = retail + shipCharged;
    if (s.salesVatMode === 'included' && salesVatRate > 0) r = r / (1 + salesVatRate / 100);
    return r - ((retail + shipCharged) * num(s.paymentFee) / 100 + num(s.fixedFee));
  })() : 0;

  const breakEvenUnits = netPerKeptSale > 0 ? Math.ceil(totalCashCosts / netPerKeptSale) : null;
  const breakEvenLoanUnits = netPerKeptSale > 0 ? Math.ceil((totalCashCosts + loanRepayment) / netPerKeptSale) : null;
  const returnFactor = 1 - returnRate / 100;
  const requiredInitialSales = returnFactor > 0 && breakEvenUnits !== null ? Math.ceil(breakEvenUnits / returnFactor) : null;
  const requiredInitialLoanSales = returnFactor > 0 && breakEvenLoanUnits !== null ? Math.ceil(breakEvenLoanUnits / returnFactor) : null;
  const breakEvenSellThrough = requiredInitialSales !== null && saleableUnits > 0 ? requiredInitialSales / saleableUnits * 100 : null;
  const breakEvenLoanSellThrough = requiredInitialLoanSales !== null && saleableUnits > 0 ? requiredInitialLoanSales / saleableUnits * 100 : null;

  const packagingWaste = Math.max(0, boxes - batch);
  const packagingShortage = Math.max(0, batch - boxes);
  const packagingTied = packagingWaste * num(v.boxCost);
  const bufferRecommended = totalCashCosts * num(l.bufferTarget) / 100;
  const maxSafeLoanPrincipal = Math.max(0, cashResult / (1 + num(l.interestRate) / 100 * (Math.max(1, num(l.loanTermMonths)) / 12)));

  return { fixed, batch, sell, defectUnits, saleableUnits, initialSold, returnedUnits, keptSales, unsoldUnits, grossReceipts, outputVat, netReceipts, paymentFees, netRevenue, productCost, boxes, packagingCost, fulfilmentCost, returnsCost, defectsCost, variableCost, contingency, totalCashCosts, cashDrawdown, cashResult, loanAmount, interest, loanRepayment, afterLoan, economicResultAfterInterest, financedCashPosition, landedCostPerUnit, netPerKeptSale, breakEvenUnits, breakEvenLoanUnits, requiredInitialSales, requiredInitialLoanSales, breakEvenSellThrough, breakEvenLoanSellThrough, packagingWaste, packagingShortage, packagingTied, bufferRecommended, maxSafeLoanPrincipal, settings: { s, v, l } };
}

function defaultExpenses() {
  return [];
}

function currentPlanExpenses() {
  return [
    { id: uid(), item: 'Physical samples / lab dips', category: 'Samples', priority: 'Essential', status: 'Placeholder', requiresApproval: 'yes', qty: 1, unitCost: 700, vatMode: 'included', vatRate: 22, notes: 'Replace with real mill quote.' },
    { id: uid(), item: 'Product photography', category: 'Photography', priority: 'Essential', status: 'Placeholder', requiresApproval: 'yes', qty: 1, unitCost: 800, vatMode: 'included', vatRate: 22, notes: 'Do not cut before launch.' },
    { id: uid(), item: 'Website / checkout refinement', category: 'Website', priority: 'Essential', status: 'Placeholder', requiresApproval: 'no', qty: 1, unitCost: 350, vatMode: 'included', vatRate: 22, notes: 'Product page, checkout, shipping/returns clarity.' },
    { id: uid(), item: 'Legal / commercialista check', category: 'Legal / Admin', priority: 'Essential', status: 'Placeholder', requiresApproval: 'no', qty: 1, unitCost: 250, vatMode: 'included', vatRate: 22, notes: 'VAT/fiscal regime, claims, loan agreement.' }
  ];
}

function save() {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(LAST_SAVED_KEY, new Date().toISOString());
  } catch {
    storageAvailable = false;
  }
}

function load() {
  if (!canUseStorage()) { state.expenses = defaultExpenses(); return; }
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { storageAvailable = false; state.expenses = defaultExpenses(); return; }
  if (!raw) { state.expenses = defaultExpenses(); save(); return; }
  try {
    const p = JSON.parse(raw);
    state.uiLang = ['en', 'it', 'pt'].includes(p.uiLang) ? p.uiLang : 'en';
    state.expenses = Array.isArray(p.expenses) ? p.expenses : defaultExpenses();
    state.scenario = { ...state.scenario, ...(p.scenario || {}) };
    state.variable = { ...state.variable, ...(p.variable || {}) };
    state.loan = { ...state.loan, ...(p.loan || {}) };
  } catch {
    state.expenses = defaultExpenses();
  }
}

function syncInputs() {
  scenarioIds.forEach(id => { if ($(id)) $(id).value = state.scenario[id]; });
  variableIds.forEach(id => { if ($(id)) $(id).value = state.variable[id]; });
  loanIds.forEach(id => { if ($(id)) $(id).value = state.loan[id]; });
  applyFiscalControls();
}

function applyFiscalControls() {
  const locked = state.scenario.fiscalMode === 'forfettario';
  if (locked) {
    state.scenario.salesVatMode = 'none';
    state.scenario.salesVatRate = 0;
  }
  if (els.salesVatRate) els.salesVatRate.disabled = locked;
  if (els.salesVatMode) els.salesVatMode.disabled = locked;
}

function render() {
  syncInputs();
  renderRows();
  renderSummary();
  applyLanguage();
  injectContextualHelp();
  updateArchiveStatus();
  save();
}

function renderRows() {
  els.expenseRows.innerHTML = '';
  if (!state.expenses.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.className = 'notes';
    td.colSpan = 11;
    td.textContent = t('expenses_empty');
    tr.appendChild(td);
    els.expenseRows.appendChild(tr);
    return;
  }
  state.expenses.forEach((exp, index) => {
    const m = expenseMath(exp);
    const tr = document.createElement('tr');
    const cells = [exp.item, labelForValue(exp.category), '', labelForValue(exp.status), exp.requiresApproval === 'yes' ? t('physical_approval') : t('no_value'), exp.qty, eur(num(exp.unitCost), 2), eur(m.gross, 2), eur(m.vat, 2), exp.notes];
    cells.forEach((value, cellIndex) => {
      const td = document.createElement('td');
      if (cellIndex === 2) td.innerHTML = `<span class="pill ${String(exp.priority).toLowerCase()}">${escapeHtml(labelForValue(exp.priority))}</span>`;
      else td.textContent = value;
      if ([6, 7, 8].includes(cellIndex)) td.className = 'money';
      if (cellIndex === 9) td.className = 'notes';
      tr.appendChild(td);
    });
    const td = document.createElement('td');
    const btn = document.createElement('button');
    btn.className = 'btn small danger';
    btn.textContent = t('delete_btn');
    btn.addEventListener('click', () => {
      if (confirm(t('delete_expense'))) {
        state.expenses.splice(index, 1);
        render();
      }
    });
    td.appendChild(btn);
    tr.appendChild(td);
    els.expenseRows.appendChild(tr);
  });
}

function row(label, value) {
  return `<div class="result-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderSummary() {
  const c = calc();
  els.cashDrawdown.textContent = eur(c.cashDrawdown);
  els.landedCost.textContent = eur(c.landedCostPerUnit, 2);
  els.netRevenue.textContent = eur(c.netRevenue);
  els.cashResult.textContent = eur(c.cashResult);
  els.afterLoan.textContent = eur(c.afterLoan);
  setColour(els.cashResult, c.cashResult);
  setColour(els.afterLoan, c.afterLoan);

  els.loanSub.textContent = tmpl('sub_repayment_over', { amount: eur(c.loanRepayment, 2), months: state.loan.loanTermMonths });
  els.breakEvenSellThrough.textContent = c.breakEvenSellThrough === null ? 'N/A' : `${Math.ceil(c.breakEvenSellThrough)}%`;
  els.breakEvenSellThrough.style.color = c.breakEvenSellThrough !== null && c.breakEvenSellThrough <= 100 ? 'var(--safe)' : 'var(--danger)';
  els.breakEvenSub.textContent = c.breakEvenUnits === null ? t('sub_set_price') : tmpl('sub_breakeven_detail', { units: c.breakEvenUnits, loanUnits: c.breakEvenLoanUnits });

  els.revenueResults.innerHTML = [
    [t('rev_batch'), c.batch],
    [t('rev_saleable'), tmpl('rev_saleable_detail', { saleable: c.saleableUnits, defects: c.defectUnits })],
    [t('rev_initialSold'), c.initialSold],
    [t('rev_returned'), c.returnedUnits],
    [t('rev_keptSales'), c.keptSales],
    [t('rev_unsold'), c.unsoldUnits],
    [t('rev_initialRequired'), c.requiredInitialSales === null ? 'N/A' : c.requiredInitialSales],
    [t('rev_grossReceipts'), eur(c.grossReceipts, 2)],
    [t('rev_outputVat'), eur(c.outputVat, 2)],
    [t('rev_paymentFees'), eur(c.paymentFees, 2)],
    [t('rev_productCost'), eur(c.productCost, 2)],
    [t('rev_boxesOrdered'), tmpl('rev_boxes_detail', { boxes: c.boxes, extra: c.packagingWaste })],
    [t('rev_packagingShortage'), c.packagingShortage],
    [t('rev_packagingTied'), eur(c.packagingTied, 2)],
    [t('rev_variableCosts'), eur(c.variableCost, 2)],
    [t('rev_fixedExpenses'), eur(c.fixed.gross, 2)],
    [t('rev_contingency'), eur(c.contingency, 2)]
  ].map(([label, value]) => row(label, value)).join('');

  const loanRows = [
    [t('loan_amount'), eur(c.loanAmount, 2)],
    [t('loan_interest_cost'), eur(c.interest, 2)],
    [t('loan_total_repayment'), eur(c.loanRepayment, 2)],
    [t('loan_breakeven_units'), c.breakEvenLoanUnits ? tmpl('loan_breakeven_units_detail', { units: c.breakEvenLoanUnits }) : 'N/A'],
    [t('loan_breakeven_sellthrough'), c.breakEvenLoanSellThrough === null ? 'N/A' : `${Math.ceil(c.breakEvenLoanSellThrough)}%`],
    [t('loan_max_safe'), eur(c.maxSafeLoanPrincipal, 2)],
    [t('loan_buffer_recommended'), eur(c.bufferRecommended, 2)],
    [t('loan_economic_after_interest'), eur(c.economicResultAfterInterest, 2)],
    [t('loan_financed_cash_position'), eur(c.financedCashPosition, 2)]
  ];
  const loanHtml = loanRows.map(([label, value]) => row(label, value)).join('') + `<div class="notice">${escapeHtml(t('loan_clarifier'))}</div>`;
  els.loanResults.innerHTML = loanHtml;
  document.querySelectorAll('.duplicate-loan-results').forEach(el => { el.innerHTML = loanHtml; });

  const warning = warningText(c);
  els.loanWarning.textContent = warning;
  document.querySelectorAll('.duplicate-loan-warning').forEach(el => { el.textContent = warning; });

  updateRailAndIndex(c);
  renderRisks(c);
  renderSensitivity();
  renderBatchComparison();
  renderStructuralBanner(c);
  renderAlerts(c);
  if (els.printHeader) els.printHeader.textContent = `MOSCATELLI FINANCIALS — CONFIDENTIAL — ${state.scenario.scenarioName} — v${APP_VERSION} — ${new Date().toLocaleDateString('en-GB')}`;
}

function warningText(c) {
  if (c.loanAmount > 0 && c.breakEvenLoanSellThrough > 100) return t('warn_structural');
  if (c.afterLoan < 0) return `${t('warn_negative_loan')} ${eur(Math.abs(c.afterLoan), 2)} ${t('warn_shortfall')}`;
  if (c.cashResult < 0) return t('warn_negative_cash');
  return t('warn_positive');
}

function renderStructuralBanner(c) {
  if (!els.structuralBanner) return;
  els.structuralBanner.classList.remove('is-critical', 'is-warning', 'is-ok');
  if (c.loanAmount > 0 && c.breakEvenLoanSellThrough > 100) {
    els.structuralBanner.classList.add('is-critical');
    els.structuralBanner.textContent = t('structural_banner_bad');
  } else if (c.cashResult < 0) {
    els.structuralBanner.classList.add('is-warning');
    els.structuralBanner.textContent = t('structural_banner_cash_bad');
  } else {
    els.structuralBanner.classList.add('is-ok');
    els.structuralBanner.textContent = t('structural_banner_ok');
  }
}

function updateRailAndIndex(c) {
  els.railScenarioName.textContent = state.scenario.scenarioName;
  els.railNetRevenue.textContent = eur(c.netRevenue);
  els.railCashResult.textContent = eur(c.cashResult);
  els.railAfterLoan.textContent = eur(c.afterLoan);
  els.railCashDrawdown.textContent = eur(c.cashDrawdown);
  els.railBreakEven.textContent = c.breakEvenSellThrough === null ? 'N/A' : `${Math.ceil(c.breakEvenSellThrough)}%`;
  els.indexScenarioName.textContent = state.scenario.scenarioName;
  els.indexCashDrawdown.textContent = eur(c.cashDrawdown);
  els.indexBreakEven.textContent = c.breakEvenSellThrough === null ? 'N/A' : `${Math.ceil(c.breakEvenSellThrough)}%`;
  els.indexAfterLoan.textContent = eur(c.afterLoan);
  setColour(els.railCashResult, c.cashResult);
  setColour(els.railAfterLoan, c.afterLoan);
  setColour(els.indexAfterLoan, c.afterLoan);

  const activeAlerts = getAlerts(c);
  const riskBad = c.breakEvenLoanSellThrough > 100 || c.afterLoan < 0 || c.packagingShortage > 0;
  els.railRiskBadge.textContent = riskBad ? t('risk_high') : t('risk_controlled_paper');
  els.indexRiskStatus.textContent = String(activeAlerts.length);
  els.indexRiskSub.textContent = t('alerts_index_sub');
}

function risk(label, level, text) { return { label, level, text }; }

function getAlerts(c) {
  const alerts = [
    { level: 'warn', title: t('alert_assumptions_title'), text: t('alert_assumptions_text') },
    { level: 'warn', title: t('alert_tax_title'), text: t('alert_tax_text') }
  ];
  if (c.loanAmount > 0 && c.breakEvenLoanSellThrough > 100) {
    alerts.push({ level: 'bad', title: t('alert_structural_title'), text: t('structural_banner_bad') });
  } else if (c.afterLoan < 0) {
    alerts.push({ level: 'warn', title: t('alert_structural_title'), text: warningText(c) });
  } else if (c.cashResult < 0) {
    alerts.push({ level: 'warn', title: t('alert_structural_title'), text: t('structural_banner_cash_bad') });
  }
  if (c.packagingShortage > 0) {
    alerts.push({ level: 'bad', title: t('risk_packaging_shortage'), text: tmpl('risk_pkg_short_bad', { shortage: c.packagingShortage }) });
  }
  return alerts;
}

function renderAlerts(c) {
  if (!els.alertsList || !els.alertsCount) return;
  const alerts = getAlerts(c);
  els.alertsCount.textContent = String(alerts.length);
  els.alertsList.innerHTML = alerts.length ? alerts.map(alert => `
    <div class="alert-item ${escapeHtml(alert.level)}">
      <strong>${escapeHtml(alert.title)}</strong>
      <p>${escapeHtml(alert.text)}</p>
    </div>
  `).join('') : `<div class="alert-item"><p>${escapeHtml(t('alerts_empty'))}</p></div>`;
}

function renderRisks(c) {
  const risks = [];
  risks.push(risk(t('risk_structural'), c.breakEvenSellThrough > 100 ? 'bad' : 'good', c.breakEvenSellThrough > 100 ? t('risk_structural_bad') : t('risk_structural_ok')));
  risks.push(risk(t('risk_loan_viability'), c.breakEvenLoanSellThrough > 100 ? 'bad' : c.breakEvenLoanSellThrough > 80 ? 'warn' : 'good', c.breakEvenLoanSellThrough > 100 ? t('risk_loan_bad') : tmpl('risk_loan_ok', { pct: Math.ceil(c.breakEvenLoanSellThrough || 0) })));
  risks.push(risk(t('risk_packaging_moq'), c.packagingWaste > c.batch * 0.5 ? 'bad' : c.packagingWaste > 0 ? 'warn' : 'good', tmpl('risk_pkg_ok', { waste: c.packagingWaste, amount: eur(c.packagingTied, 0) })));
  risks.push(risk(t('risk_packaging_shortage'), c.packagingShortage > 0 ? 'bad' : 'good', c.packagingShortage > 0 ? tmpl('risk_pkg_short_bad', { shortage: c.packagingShortage }) : t('risk_pkg_short_ok')));
  risks.push(risk(t('risk_placeholders'), c.fixed.placeholders > 0 ? 'warn' : 'good', tmpl('risk_placeholders_text', { count: c.fixed.placeholders })));
  risks.push(risk(t('risk_cash_drawdown'), c.cashDrawdown > 4100 ? 'warn' : 'good', tmpl('risk_drawdown_text', { amount: eur(c.cashDrawdown, 0) })));
  risks.push(risk(t('risk_vanity_spend'), c.fixed.vanity > 0 ? 'warn' : 'good', tmpl('risk_vanity_text', { amount: eur(c.fixed.vanity, 0) })));
  risks.push(risk(t('risk_fiscal_mode'), state.scenario.fiscalMode === 'forfettario' && state.scenario.salesVatMode !== 'none' ? 'bad' : 'good', state.scenario.fiscalMode === 'forfettario' ? t('risk_forfettario_caution') : t('risk_fiscal_check')));
  risks.push(risk(t('risk_tax_excluded'), 'warn', t('risk_tax_text')));

  els.riskDashboard.innerHTML = risks.map(r => `<div class="risk-item ${r.level === 'bad' ? 'has-critical' : ''}"><span class="pill ${r.level}">${escapeHtml(t('level_' + r.level))}</span><strong>${escapeHtml(r.label)}</strong><p>${escapeHtml(r.text)}</p></div>`).join('');
}

function renderSensitivity() {
  els.sensitivityRows.innerHTML = [25, 50, 75, 100].map(p => {
    const c = calc({ scenario: { sellThrough: p } });
    return `<tr><td>${p}%</td><td>${c.keptSales}</td><td class="money">${eur(c.netRevenue, 2)}</td><td class="money" style="color:${c.cashResult >= 0 ? 'var(--safe)' : 'var(--danger)'}">${eur(c.cashResult, 2)}</td><td class="money" style="color:${c.afterLoan >= 0 ? 'var(--safe)' : 'var(--danger)'}">${eur(c.afterLoan, 2)}</td></tr>`;
  }).join('');
}

function renderBatchComparison() {
  els.batchRows.innerHTML = [15, 30, 50, 75, 100].map(b => {
    const c = calc({ scenario: { batchSize: b } });
    return `<tr><td>${b}</td><td>${c.boxes}</td><td class="money">${eur(c.cashDrawdown, 2)}</td><td>${c.breakEvenSellThrough === null ? 'N/A' : Math.ceil(c.breakEvenSellThrough) + '%'}</td><td class="money" style="color:${c.afterLoan >= 0 ? 'var(--safe)' : 'var(--danger)'}">${eur(c.afterLoan, 2)}</td></tr>`;
  }).join('');
}

function setColour(el, value) { if (el) el.style.color = value >= 0 ? 'var(--safe)' : 'var(--danger)'; }

function addExpense() {
  const item = els.item.value.trim();
  if (!item) { els.item.focus(); return; }
  state.expenses.push({ id: uid(), item, category: els.category.value, priority: els.priority.value, status: els.status.value, requiresApproval: els.requiresApproval.value, qty: num(els.qty.value), unitCost: num(els.unitCost.value), vatMode: els.vatMode.value, vatRate: num(els.vatRateExpense.value), notes: els.notes.value.trim() });
  els.item.value = ''; els.qty.value = 1; els.unitCost.value = 0; els.notes.value = ''; els.item.focus();
  render();
}

function applyCurrentPlan() {
  Object.assign(state.scenario, { scenarioName: 'Current plan · 15 scarf launch', scenarioStatus: 'Draft', fiscalMode: 'forfettario', retailPrice: 350, batchSize: 15, sellThrough: 100, salesVatRate: 0, salesVatMode: 'none', paymentFee: 3, fixedFee: 0.30, shippingCharged: 0 });
  Object.assign(state.variable, { productionUnitCost: 0, smallBatchPremium: 0, setupFee: 0, dyeingSurcharge: 0, colourCount: 1, fringeCost: 0, labelCost: 0, inboundShipping: 0, packagingMode: 'auto', packagingMoq: 0, boxesOrdered: 0, boxCost: 0, fulfilmentCost: 0, outboundShipping: 0, returnRate: 0, returnPenalty: 0, defectRate: 0, defectPenalty: 0, contingencyRate: 0 });
  Object.assign(state.loan, { loanAmount: 0, interestRate: 0, loanTermMonths: 12, bufferTarget: 0 });
  state.expenses = currentPlanExpenses();
}

function preset(name) {
  if (name === 'currentPlan') {
    applyCurrentPlan();
    render();
    return;
  }
  const map = {
    bootstrap15: { batchSize: 15, sellThrough: 100, scenarioName: 'Bootstrap 15-unit proof', loanAmount: 0, packagingMoq: 30, boxesOrdered: 30, smallBatchPremium: 35 },
    private30: { batchSize: 30, sellThrough: 80, scenarioName: 'Private 30-unit allocation', loanAmount: 0, packagingMoq: 30, boxesOrdered: 30, smallBatchPremium: 25 },
    pilot50: { batchSize: 50, sellThrough: 75, scenarioName: 'Disciplined 50-unit pilot', loanAmount: 5000, packagingMoq: 50, boxesOrdered: 50, smallBatchPremium: 15 },
    loan75: { batchSize: 75, sellThrough: 75, scenarioName: 'Loan-backed 75-unit pilot', loanAmount: 15000, packagingMoq: 100, boxesOrdered: 100, smallBatchPremium: 8 },
    loan100: { batchSize: 100, sellThrough: 75, scenarioName: 'Loan-backed 100-unit pilot', loanAmount: 15000, packagingMoq: 100, boxesOrdered: 100, smallBatchPremium: 0 }
  }[name];
  if (!map) return;
  Object.assign(state.scenario, { batchSize: map.batchSize, sellThrough: map.sellThrough, scenarioName: map.scenarioName });
  Object.assign(state.loan, { loanAmount: map.loanAmount });
  Object.assign(state.variable, { packagingMoq: map.packagingMoq, boxesOrdered: map.boxesOrdered, smallBatchPremium: map.smallBatchPremium });
  render();
}

function updateArchiveStatus() {
  let saved = null, backup = null;
  if (storageAvailable) {
    try { saved = localStorage.getItem(LAST_SAVED_KEY); backup = localStorage.getItem(LAST_BACKUP_KEY); } catch { storageAvailable = false; }
  }
  if (els.lastSavedStatus) els.lastSavedStatus.textContent = saved ? tmpl('last_saved', { date: new Date(saved).toLocaleString('en-GB') }) : t('last_saved_never');
  if (els.lastBackupStatus) els.lastBackupStatus.textContent = backup ? tmpl('last_backup', { date: new Date(backup).toLocaleString('en-GB') }) : t('last_backup_never');
}

function exportCsv() {
  const c = calc();
  const lines = ['\ufeffMoscatelli Financial Workstation v' + APP_VERSION, 'Exported,' + new Date().toLocaleString('en-GB'), 'Scenario,' + csv(state.scenario.scenarioName), 'Status,' + csv(state.scenario.scenarioStatus), 'Disclaimer,"Pre-income-tax, pre-INPS, pre-founder-withdrawal"', ''];
  lines.push('Summary,Value');
  [['Cash drawdown', c.cashDrawdown], ['True landed cost per unit', c.landedCostPerUnit], ['Net revenue', c.netRevenue], ['Cash result', c.cashResult], ['Economic result after interest', c.economicResultAfterInterest], ['Financed cash position', c.financedCashPosition], ['Loan repayment', c.loanRepayment], ['After full loan repayment', c.afterLoan], ['Break-even kept units', c.breakEvenUnits], ['Initial sales required after returns', c.requiredInitialSales], ['Break-even sell-through %', c.breakEvenSellThrough], ['Maximum safe loan', c.maxSafeLoanPrincipal]].forEach(r => lines.push(r.map(csv).join(',')));
  lines.push('', 'Scenario Inputs'); Object.entries(state.scenario).forEach(([k, v]) => lines.push([k, v].map(csv).join(',')));
  lines.push('', 'Variable Unit Economics'); Object.entries(state.variable).forEach(([k, v]) => lines.push([k, v].map(csv).join(',')));
  lines.push('', 'Loan Inputs'); Object.entries(state.loan).forEach(([k, v]) => lines.push([k, v].map(csv).join(',')));
  lines.push('', 'Fixed Expenses'); lines.push(['Item', 'Category', 'Priority', 'Status', 'Gate', 'Qty', 'Unit Cost', 'Gross', 'VAT', 'Notes'].join(','));
  state.expenses.forEach(e => { const m = expenseMath(e); lines.push([e.item, e.category, e.priority, e.status, e.requiresApproval, e.qty, e.unitCost, m.gross.toFixed(2), m.vat.toFixed(2), e.notes].map(csv).join(',')); });
  lines.push('', 'Risk Snapshot'); riskSnapshot(c).forEach(r => lines.push([r.label, r.level, r.text].map(csv).join(',')));
  lines.push('', 'Sensitivity'); lines.push('Sell-through,Kept Sales,Net Revenue,Cash Result,After Loan');
  [25, 50, 75, 100].forEach(p => { const x = calc({ scenario: { sellThrough: p } }); lines.push([p, x.keptSales, x.netRevenue.toFixed(2), x.cashResult.toFixed(2), x.afterLoan.toFixed(2)].join(',')); });
  lines.push('', 'Batch Comparison'); lines.push('Batch,Boxes,Cash Drawdown,Break-even %,After Loan');
  [15, 30, 50, 75, 100].forEach(b => { const x = calc({ scenario: { batchSize: b } }); lines.push([b, x.boxes, x.cashDrawdown.toFixed(2), x.breakEvenSellThrough === null ? 'N/A' : Math.ceil(x.breakEvenSellThrough), x.afterLoan.toFixed(2)].join(',')); });
  download(`moscatelli-financial-workstation_${stamp()}.csv`, lines.join('\n'), 'text/csv;charset=utf-8');
}

function riskSnapshot(c) {
  return [
    { label: t('risk_structural'), level: c.breakEvenSellThrough > 100 ? 'bad' : 'good', text: c.breakEvenSellThrough > 100 ? t('risk_structural_bad') : t('risk_structural_ok') },
    { label: t('risk_loan_viability'), level: c.breakEvenLoanSellThrough > 100 ? 'bad' : c.breakEvenLoanSellThrough > 80 ? 'warn' : 'good', text: c.breakEvenLoanSellThrough > 100 ? t('risk_loan_bad') : tmpl('risk_loan_ok', { pct: Math.ceil(c.breakEvenLoanSellThrough || 0) }) },
    { label: t('risk_packaging_shortage'), level: c.packagingShortage > 0 ? 'bad' : 'good', text: c.packagingShortage > 0 ? tmpl('risk_pkg_short_bad', { shortage: c.packagingShortage }) : t('risk_pkg_short_ok') },
    { label: t('risk_tax_excluded'), level: 'warn', text: t('risk_tax_text') }
  ];
}

function stateWrapper() {
  return { app: 'Moscatelli Financial Workstation', version: APP_VERSION, appVersion: APP_VERSION, schemaVersion: SCHEMA_VERSION, savedAtIso: new Date().toISOString(), savedAtLocal: new Date().toLocaleString('en-GB'), scenarioName: state.scenario.scenarioName, currency: 'EUR', locale: 'en-IE', calculationSnapshot: calc(), state };
}

function exportBackup() {
  const now = new Date().toISOString();
  if (storageAvailable) { try { localStorage.setItem(LAST_BACKUP_KEY, now); } catch { storageAvailable = false; } }
  const filename = `moscatelli-financial-workstation-backup_${stamp()}.json`;
  download(filename, JSON.stringify(stateWrapper(), null, 2), 'application/json;charset=utf-8');
  if (els.backupStatus) els.backupStatus.textContent = tmpl('backup_saved', { file: filename });
  updateArchiveStatus();
}

function migrateBackup(data) { return data; }

function allowed(value, list, fallback) { return list.includes(value) ? value : fallback; }
function cleanNumber(value, fallback = 0, min = 0, max = Infinity) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function validateImportedState(incoming) {
  let corrections = 0;
  const clean = JSON.parse(JSON.stringify(incoming || {}));
  const scenarioDefaults = state.scenario;
  const variableDefaults = state.variable;
  const loanDefaults = state.loan;
  clean.uiLang = allowed(clean.uiLang, ['en', 'it', 'pt'], 'en');
  clean.scenario = { ...scenarioDefaults, ...(clean.scenario || {}) };
  clean.variable = { ...variableDefaults, ...(clean.variable || {}) };
  clean.loan = { ...loanDefaults, ...(clean.loan || {}) };

  const before = JSON.stringify(clean);
  clean.scenario.scenarioStatus = allowed(clean.scenario.scenarioStatus, ['Draft', 'Quote-based', 'Sample approved', 'Approved', 'Final'], 'Draft');
  clean.scenario.fiscalMode = allowed(clean.scenario.fiscalMode, ['forfettario', 'standardVat', 'customNoVat'], 'forfettario');
  clean.scenario.salesVatMode = allowed(clean.scenario.salesVatMode, ['none', 'included', 'excluded'], 'none');
  ['retailPrice','batchSize','sellThrough','salesVatRate','paymentFee','fixedFee','shippingCharged'].forEach(k => { clean.scenario[k] = cleanNumber(clean.scenario[k], scenarioDefaults[k], 0); });
  clean.scenario.sellThrough = clamp(clean.scenario.sellThrough, 0, 100);
  clean.variable.packagingMode = allowed(clean.variable.packagingMode, ['auto', 'manual'], 'auto');
  variableIds.filter(k => k !== 'packagingMode').forEach(k => { clean.variable[k] = cleanNumber(clean.variable[k], variableDefaults[k], 0); });
  clean.variable.returnRate = clamp(clean.variable.returnRate, 0, 100);
  clean.variable.defectRate = clamp(clean.variable.defectRate, 0, 100);
  loanIds.forEach(k => { clean.loan[k] = cleanNumber(clean.loan[k], loanDefaults[k], 0); });
  clean.loan.loanTermMonths = Math.max(1, clean.loan.loanTermMonths);
  clean.expenses = Array.isArray(clean.expenses) ? clean.expenses.map(x => ({
    id: String(x.id || uid()), item: String(x.item || 'Untitled expense'), category: String(x.category || 'Other'), priority: allowed(x.priority, ['Essential', 'Optional', 'Vanity'], 'Essential'), status: allowed(x.status, ['Placeholder', 'Quote requested', 'Quote received', 'Sample approved', 'Approved', 'Paid'], 'Placeholder'), requiresApproval: x.requiresApproval === 'no' ? 'no' : 'yes', qty: cleanNumber(x.qty, 0, 0), unitCost: cleanNumber(x.unitCost, 0, 0), vatMode: allowed(x.vatMode, ['included', 'excluded', 'none'], 'included'), vatRate: cleanNumber(x.vatRate, 0, 0), notes: String(x.notes || '')
  })) : defaultExpenses();
  if (JSON.stringify(clean) !== before) corrections += 1;
  return { clean, corrections };
}

function openImportConfirm(file) {
  pendingImportFile = file;
  els.importConfirmModal.classList.add('is-open');
  els.importConfirmModal.setAttribute('aria-hidden', 'false');
}

function closeImportConfirm() {
  pendingImportFile = null;
  els.importConfirmModal.classList.remove('is-open');
  els.importConfirmModal.setAttribute('aria-hidden', 'true');
  if (els.backupFileInput) els.backupFileInput.value = '';
}

function loadBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    try {
      const parsed = JSON.parse(String(event.target.result || ''));
      const p = migrateBackup(parsed);
      const incoming = p.state || p;
      if (!incoming || !Array.isArray(incoming.expenses)) throw new Error('Invalid Moscatelli backup format.');
      const { clean, corrections } = validateImportedState(incoming);
      state.uiLang = clean.uiLang;
      state.expenses = clean.expenses;
      state.scenario = clean.scenario;
      state.variable = clean.variable;
      state.loan = clean.loan;
      render();
      const msg = corrections ? tmpl('import_corrected', { count: corrections }) : tmpl('import_loaded', { file: file.name });
      if (els.backupStatus) els.backupStatus.textContent = msg;
    } catch (err) {
      if (els.backupStatus) els.backupStatus.textContent = tmpl('import_error', { message: err.message });
    } finally {
      closeImportConfirm();
    }
  };
  reader.readAsText(file);
}

function buildScenarioSummary() {
  const c = calc();
  const fixedRows = state.expenses.map(e => `- ${e.item}: ${e.qty} × ${eur(num(e.unitCost), 2)} | ${e.priority} | ${e.status}`).join('\n');
  return `MOSCATELLI FINANCIAL WORKSTATION — SEVERE REVIEW PACKET\n\nVersion: ${APP_VERSION}\nScenario: ${state.scenario.scenarioName}\nStatus: ${state.scenario.scenarioStatus}\nFiscal mode: ${state.scenario.fiscalMode}\nRetail price: ${eur(num(state.scenario.retailPrice), 2)}\nBatch size: ${c.batch}\nSell-through assumption: ${state.scenario.sellThrough}%\nReturn rate: ${state.variable.returnRate}%\nDefect rate: ${state.variable.defectRate}%\nVAT mode: ${state.scenario.salesVatMode} / ${state.scenario.salesVatRate}%\n\nUNIT ECONOMICS\nProduction/unit: ${eur(num(state.variable.productionUnitCost), 2)}\nSmall batch premium: ${state.variable.smallBatchPremium}%\nPackaging MOQ: ${state.variable.packagingMoq}\nBoxes ordered: ${c.boxes}\nPackaging shortage: ${c.packagingShortage}\nTrue landed cost/unit: ${eur(c.landedCostPerUnit, 2)}\n\nRESULTS\nMax cash drawdown: ${eur(c.cashDrawdown, 2)}\nNet revenue: ${eur(c.netRevenue, 2)}\nCash result before loan: ${eur(c.cashResult, 2)}\nInterest cost: ${eur(c.interest, 2)}\nEconomic result after interest only: ${eur(c.economicResultAfterInterest, 2)}\nFull loan repayment: ${eur(c.loanRepayment, 2)}\nBatch surplus after full principal repayment: ${eur(c.afterLoan, 2)}\nFinanced cash position after repayment: ${eur(c.financedCashPosition, 2)}\nBreak-even kept sales: ${c.breakEvenUnits ?? 'N/A'}\nInitial sales required after returns: ${c.requiredInitialSales ?? 'N/A'}\nBreak-even sell-through after returns: ${c.breakEvenSellThrough === null ? 'N/A' : Math.ceil(c.breakEvenSellThrough) + '%'}\nBreak-even with loan after returns: ${c.breakEvenLoanSellThrough === null ? 'N/A' : Math.ceil(c.breakEvenLoanSellThrough) + '%'}\n\nFIXED EXPENSES\n${fixedRows}\n\nTAX EXCLUSIONS\nThis model is pre-income-tax, pre-INPS, pre-founder-withdrawal, and subject to commercialista confirmation.\n\nREVIEW REQUEST\nAct as a severe financial launch auditor. Check mathematical consistency, Italian fiscal assumptions, cash risk, debt risk, packaging MOQ exposure, false optimism, and what must be validated by supplier quotes or physical samples.`;
}

async function copyScenarioSummary() {
  try { await navigator.clipboard.writeText(buildScenarioSummary()); alert(t('alert_copied')); }
  catch { alert(buildScenarioSummary()); }
}

function buildScenarioAiPayload() {
  const c = calc();
  return {
    app: 'Moscatelli Financial Workstation',
    appVersion: APP_VERSION,
    generatedAt: new Date().toISOString(),
    scenario: { ...state.scenario },
    variableAssumptions: { ...state.variable },
    loanAssumptions: { ...state.loan },
    fixedExpenses: state.expenses.map(exp => ({ ...exp })),
    results: {
      cashDrawdown: c.cashDrawdown,
      trueLandedCostPerUnit: c.landedCostPerUnit,
      netRevenue: c.netRevenue,
      cashResult: c.cashResult,
      interestCost: c.interest,
      economicResultAfterInterest: c.economicResultAfterInterest,
      fullLoanRepayment: c.loanRepayment,
      batchSurplusAfterFullLoanRepayment: c.afterLoan,
      financedCashPosition: c.financedCashPosition,
      breakEvenKeptSales: c.breakEvenUnits,
      requiredInitialSalesAfterReturns: c.requiredInitialSales,
      breakEvenSellThroughAfterReturns: c.breakEvenSellThrough,
      breakEvenLoanSellThroughAfterReturns: c.breakEvenLoanSellThrough,
      packagingShortage: c.packagingShortage,
      boxesOrdered: c.boxes
    },
    warnings: [
      'Pre-income-tax, pre-INPS, pre-founder-withdrawal model.',
      'Figures remain assumptions until validated by supplier quotes, physical samples, commercialista guidance, and buyer commitments.'
    ]
  };
}

function setAiResponse(text, isError = false) {
  if (!els.aiResponse) return;
  els.aiResponse.textContent = text || '';
  els.aiResponse.classList.toggle('is-visible', Boolean(text));
  els.aiResponse.classList.toggle('is-error', Boolean(isError));
}

async function askFinancialAssistant() {
  const endpoint = (els.aiEndpointUrl?.value || '').trim();
  if (!endpoint) {
    setAiResponse(t('assistant_ai_missing_endpoint'), true);
    return;
  }
  try {
    localStorage.setItem('mfw_netlify_function_url', endpoint);
  } catch {}
  if (els.askAiBtn) els.askAiBtn.disabled = true;
  if (els.aiStatusLine) els.aiStatusLine.textContent = t('assistant_ai_loading');
  setAiResponse(t('assistant_ai_loading'));
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildScenarioAiPayload())
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.detail || response.statusText || 'Request failed');
    setAiResponse(data.text || 'No readable response returned.');
    if (els.aiStatusLine) els.aiStatusLine.textContent = t('assistant_panel_status');
  } catch (error) {
    setAiResponse(tmpl('assistant_ai_error', { message: error.message }), true);
  } finally {
    if (els.askAiBtn) els.askAiBtn.disabled = false;
  }
}

function toggleAssistant(open) {
  els.assistantPanel.classList.toggle('is-open', open);
  els.assistantPanel.setAttribute('aria-hidden', String(!open));
}


const academyCurriculum = {
  "en": [
    {
      "id": "start",
      "type": "start",
      "title": "I · Start here",
      "description": "First-use path. Read this before changing any number.",
      "lessons": [
        {
          "title": "Your first 10 minutes",
          "purpose": "Purpose: open the workstation, load the right model, and avoid accidental damage.",
          "steps": [
            "Open Academy once, then go to Calculator.",
            "Load Current Plan only for the Terra Bruna / Bianco Avorio scarf launch.",
            "Open Overview and read the bell alerts.",
            "Save a JSON backup before changing anything."
          ],
          "warning": "Do not begin by editing prices, batch size, VAT, or loan values. First understand the current scenario.",
          "action": "Load Current Plan, then open Overview.",
          "tab": "overview",
          "route": "calculator",
          "preset": "currentPlan",
          "badge": "START HERE"
        },
        {
          "title": "What may be changed safely",
          "purpose": "Purpose: clarify safe edits.",
          "steps": [
            "Replace placeholder costs with supplier quotes.",
            "Update quote status and notes.",
            "Add supplier name, date, quantity, and source.",
            "Export JSON and CSV after important updates."
          ],
          "warning": "A number without source notes becomes dangerous later, even if it is correct today.",
          "action": "Open Fixed Expenses and check which entries are still placeholders.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "What must not be changed alone",
          "purpose": "Purpose: protect strategic assumptions.",
          "steps": [
            "Do not change retail price without leadership approval.",
            "Do not change fiscal mode without a commercialista decision.",
            "Do not change loan amount for a serious scenario without approval.",
            "Do not mark anything Final without written confirmation."
          ],
          "warning": "The workstation is not a place for experiments inside the official scenario. Duplicate or save a backup first.",
          "action": "Open Archive and save a backup before testing changes.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "The correct order of use",
          "purpose": "Purpose: follow the same sequence every time.",
          "steps": [
            "Load Current Plan or a dated backup.",
            "Check bell alerts and Risk.",
            "Update only documented numbers.",
            "Review Sensitivity and Comparison.",
            "Export backup and report what changed."
          ],
          "warning": "Skipping the order creates confusion: a changed cost without a saved backup is not an operating record.",
          "action": "Open Risk, then return to Archive for a dated backup.",
          "tab": "risk",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "playbooks",
      "type": "playbook",
      "title": "II · Playbooks",
      "description": "Use these when a real task arrives. Do not improvise.",
      "lessons": [
        {
          "title": "I received a supplier quote",
          "purpose": "Purpose: enter a quote without corrupting the model.",
          "steps": [
            "Load Current Plan or the relevant backup.",
            "Go to the correct cost area: Unit Economics or Fixed Expenses.",
            "Enter the quoted amount and quantity.",
            "Write supplier, date, quantity, and whether the quote is written or verbal.",
            "Save a JSON backup."
          ],
          "warning": "Never mix a quote for 50 units with a scenario for 15 units without a note explaining the mismatch.",
          "action": "Load Current Plan, then open Unit Economics.",
          "tab": "unit",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "I need to update packaging cost",
          "purpose": "Purpose: avoid the packaging MOQ trap.",
          "steps": [
            "Open Unit Economics.",
            "Check Packaging MOQ, Boxes Ordered, and Cost / Box.",
            "Confirm boxes are not fewer than scarves.",
            "Read Packaging Shortage and Packaging Cash Tied in Extras.",
            "Save a backup after the update."
          ],
          "warning": "A beautiful box can still be a cash trap. Packaging must serve the proof event, not consume it.",
          "action": "Open Unit Economics and inspect the packaging fields.",
          "tab": "unit",
          "route": "calculator"
        },
        {
          "title": "I need to check if the Current Plan is viable",
          "purpose": "Purpose: make a quick viability check without financial jargon.",
          "steps": [
            "Load Current Plan.",
            "Open Overview and read Cash Drawdown.",
            "Open Risk and check red items.",
            "Open Comparison and compare 15 / 30 / 50 / 75 / 100 units.",
            "Do not approve the plan if break-even exceeds 100%."
          ],
          "warning": "A plan that works only at perfect sell-through is not safe. It is fragile.",
          "action": "Load Current Plan and open Comparison.",
          "tab": "comparison",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "I need to prepare a review report",
          "purpose": "Purpose: send useful information, not screenshots alone.",
          "steps": [
            "Open the bell and note warnings.",
            "Export JSON backup.",
            "Export CSV.",
            "Open Assistant and copy the severe review packet.",
            "Write three lines: what changed, why it changed, what risk remains."
          ],
          "warning": "Screenshots are not records. A proper report includes the backup or the scenario summary.",
          "action": "Open Assistant and copy the review packet.",
          "tab": null,
          "route": "assistant"
        },
        {
          "title": "I made a mistake",
          "purpose": "Purpose: recover without panic.",
          "steps": [
            "Stop editing immediately.",
            "Do not try to remember every change.",
            "Open Archive.",
            "Load the last known correct JSON backup.",
            "Record what happened and which backup was restored."
          ],
          "warning": "Trying to fix a mistake from memory usually creates a second mistake.",
          "action": "Open Archive and load the last correct backup.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "I do not understand a warning",
          "purpose": "Purpose: treat warnings as decision gates.",
          "steps": [
            "Open the Risk tab.",
            "Read the warning sentence slowly.",
            "Find the related field in the calculator.",
            "Do not override the warning by optimism.",
            "Ask for leadership review if the financial consequence is unclear."
          ],
          "warning": "A warning is not decoration. It means the model found a structural weakness or unverified assumption.",
          "action": "Open Risk and identify the first red warning.",
          "tab": "risk",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "concepts",
      "type": "concept",
      "title": "III · Concepts with examples",
      "description": "Plain explanations of the numbers used in weekly review.",
      "lessons": [
        {
          "title": "True landed cost",
          "purpose": "Purpose: understand what one finished scarf really costs.",
          "steps": [
            "Start with production cost.",
            "Add fringe, labels, setup, dyeing, inbound shipping, and packaging.",
            "Divide by batch size when needed.",
            "Use this number before judging retail margin."
          ],
          "warning": "A supplier quote is not landed cost. It is only one part of the finished product cost.",
          "action": "Open Overview and read True Landed Cost / Unit.",
          "tab": "overview",
          "route": "calculator"
        },
        {
          "title": "Sell-through and kept sales",
          "purpose": "Purpose: separate interest from real retained sales.",
          "steps": [
            "If 20 scarves are produced and 10 sell, sell-through is 50%.",
            "If 2 are returned, kept sales are 8.",
            "Break-even must be judged after returns.",
            "Small launches are damaged by even one or two returns."
          ],
          "warning": "Do not say ‘we sold 10’ if two came back. The model cares about kept sales.",
          "action": "Open Sensitivity and compare different sell-through levels.",
          "tab": "comparison",
          "route": "calculator"
        },
        {
          "title": "Cash drawdown",
          "purpose": "Purpose: know how much cash is needed before sales arrive.",
          "steps": [
            "Production may require payment before launch.",
            "Packaging may require MOQ before sales.",
            "Photography and legal work happen before revenue.",
            "Cash drawdown answers: how deep is the hole first?"
          ],
          "warning": "A scenario can look profitable later and still fail because there is not enough cash at the beginning.",
          "action": "Open Overview and read Max Cash Drawdown.",
          "tab": "overview",
          "route": "calculator"
        },
        {
          "title": "Break-even",
          "purpose": "Purpose: know how many kept sales are needed to avoid loss.",
          "steps": [
            "Break-even is not a dream target.",
            "It is the minimum required to cover costs.",
            "The workstation also shows required initial sales after returns.",
            "If break-even is above the batch, the scenario cannot work."
          ],
          "warning": "Do not approve a scenario whose break-even depends on perfect conditions.",
          "action": "Open Risk and read structural viability.",
          "tab": "risk",
          "route": "calculator"
        },
        {
          "title": "Packaging MOQ",
          "purpose": "Purpose: understand why packaging can distort the budget.",
          "steps": [
            "MOQ means minimum order quantity.",
            "A 15-scarf launch may still require 30, 50, or 100 boxes.",
            "Extra boxes tie cash before they create value.",
            "Manual box quantity below batch size creates a shortage warning."
          ],
          "warning": "Do not lower box quantity just to make the scenario look cheaper.",
          "action": "Open Unit Economics and check MOQ and Boxes Ordered.",
          "tab": "unit",
          "route": "calculator"
        },
        {
          "title": "Debt, capital, and liquidity",
          "purpose": "Purpose: separate borrowed money from profit.",
          "steps": [
            "Loan proceeds can finance costs.",
            "Interest is the cost of borrowing.",
            "Principal repayment consumes future cash.",
            "Financed cash position is not the same as profit."
          ],
          "warning": "Borrowed money can make the bank balance look stronger while the business model remains weak.",
          "action": "Open Loan & Capital and read the financing metrics.",
          "tab": "loan",
          "route": "calculator"
        },
        {
          "title": "Regime Forfettario",
          "purpose": "Purpose: avoid false VAT assumptions.",
          "steps": [
            "Forfettario normally means no sales VAT in this model.",
            "The app does not calculate income tax.",
            "The app does not calculate INPS.",
            "A commercialista must confirm fiscal treatment before decisions."
          ],
          "warning": "Never treat Cash Result as founder-available money. Taxes and contributions are outside this model.",
          "action": "Open Launch and confirm fiscal mode.",
          "tab": "launch",
          "route": "calculator"
        },
        {
          "title": "Contingency",
          "purpose": "Purpose: protect the plan from small errors.",
          "steps": [
            "Contingency is a reserve, not spare money.",
            "Use it for uncertainty in quotes, shipping, samples, or defects.",
            "Do not spend the reserve on aesthetics.",
            "If quotes become real, contingency can be reviewed."
          ],
          "warning": "Removing contingency to make the plan look elegant is financial self-deception.",
          "action": "Open Unit Economics and review Contingency %.",
          "tab": "unit",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "discipline",
      "type": "discipline",
      "title": "IV · Moscatelli launch discipline",
      "description": "The rules for using the workstation during the scarf proof event.",
      "lessons": [
        {
          "title": "Daily Current Plan workflow",
          "purpose": "Purpose: make Current Plan the safe starting point.",
          "steps": [
            "Load Current Plan only when working on Terra Bruna / Bianco Avorio.",
            "Check placeholders before changing numbers.",
            "Update one assumption at a time.",
            "Save backup after the change.",
            "Report the financial effect for leadership review."
          ],
          "warning": "Current Plan is not truth. It is the latest working model until quotes, samples, and sales prove it.",
          "action": "Load Current Plan and open Overview.",
          "tab": "overview",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Supplier quote discipline",
          "purpose": "Purpose: make every supplier number traceable.",
          "steps": [
            "Record supplier name.",
            "Record date and quantity quoted.",
            "State whether the quote is written or verbal.",
            "Do not combine quotes from different quantities without notes."
          ],
          "warning": "A clean note is more valuable than a beautiful estimate.",
          "action": "Open Fixed Expenses and review notes/status.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Sample approval discipline",
          "purpose": "Purpose: protect product quality from spreadsheet optimism.",
          "steps": [
            "A sample must be physically reviewed.",
            "Colour, hand, drape, fringe, and packaging fit matter.",
            "Do not mark Sample Approved from photos alone.",
            "Do not treat digital mockups as manufacturing proof."
          ],
          "warning": "Luxury is lost when the spreadsheet approves what the hand has not tested.",
          "action": "Open Fixed Expenses and check approval gates.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Photography discipline",
          "purpose": "Purpose: classify visual spending correctly.",
          "steps": [
            "Photography may be Essential if it supports conversion and documentation.",
            "Video and atmosphere can wait if cash is tight.",
            "Images must match the actual product.",
            "Do not let visual polish outrun physical proof."
          ],
          "warning": "Beautiful images that exceed the real scarf create future disappointment.",
          "action": "Open Fixed Expenses and review photography cost/status.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Debt decision gate",
          "purpose": "Purpose: stop debt from disguising weak economics.",
          "steps": [
            "Check cash drawdown first.",
            "Check break-even with loan.",
            "Check 50% and 75% sensitivity.",
            "Confirm supplier quotes are real.",
            "Do not discuss debt if the model fails under stress."
          ],
          "warning": "If debt only works in the most optimistic case, it is pressure, not funding.",
          "action": "Open Loan & Capital, then Comparison.",
          "tab": "loan",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "reference",
      "type": "reference",
      "title": "V · Checklists and glossary",
      "description": "Short reference for repeated tasks.",
      "lessons": [
        {
          "title": "Before editing any number",
          "purpose": "Purpose: avoid damaging the working file.",
          "steps": [
            "Confirm you are in the correct scenario.",
            "Save a backup first.",
            "Know whether the value is a quote, estimate, or paid cost.",
            "Write the source in Notes."
          ],
          "warning": "Numbers without source notes become unreliable very quickly.",
          "action": "Open Archive and save a backup.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "Before sending for review",
          "purpose": "Purpose: send a useful operating report.",
          "steps": [
            "Check bell alerts.",
            "Open Risk and note red warnings.",
            "Export JSON and CSV.",
            "Copy the Assistant review packet.",
            "Write what changed in plain language."
          ],
          "warning": "Do not send only screenshots. Screenshots do not preserve the model.",
          "action": "Open Assistant and copy the review packet.",
          "tab": null,
          "route": "assistant"
        },
        {
          "title": "Glossary quick reference",
          "purpose": "Purpose: define the core terms without finance theatre.",
          "steps": [
            "COGS: cost of goods sold.",
            "Landed cost: physical cost of the finished unit, including packaging and inbound costs.",
            "Cash drawdown: maximum cash required before sales arrive.",
            "Sell-through: percentage initially sold.",
            "Kept sales: sales remaining after returns.",
            "MOQ: minimum order quantity.",
            "Contingency: reserve for uncertainty, not spare money."
          ],
          "warning": "If a term is unclear, stop. Do not edit the assumption until it is understood.",
          "action": "Use Academy first, then Calculator.",
          "tab": null,
          "route": "academy"
        },
        {
          "title": "Forbidden habits",
          "purpose": "Purpose: remove the most dangerous behaviours.",
          "steps": [
            "Do not change fiscal mode casually.",
            "Do not lower costs to make a scenario look better.",
            "Do not mark placeholders as final.",
            "Do not hide red warnings.",
            "Do not use screenshots as the only record."
          ],
          "warning": "The workstation protects Moscatelli only if the operator respects the evidence.",
          "action": "Open Risk and verify there are no ignored red warnings.",
          "tab": "risk",
          "route": "calculator"
        },
        {
          "title": "When to stop and ask",
          "purpose": "Purpose: define the escalation point.",
          "steps": [
            "Stop if a number changes the decision.",
            "Stop if a quote contradicts the Current Plan.",
            "Stop if VAT, INPS, or tax treatment is involved.",
            "Stop if the model says debt is structurally impossible."
          ],
          "warning": "Asking early is not weakness. It prevents expensive corrections later.",
          "action": "Open Assistant and copy the scenario summary for review.",
          "tab": null,
          "route": "assistant"
        }
      ]
    }
  ],
  "it": [
    {
      "id": "start",
      "type": "start",
      "title": "I · Inizia da qui",
      "description": "Percorso iniziale. Da leggere prima di modificare qualsiasi numero.",
      "lessons": [
        {
          "title": "I primi 10 minuti",
          "purpose": "Scopo: aprire lo strumento, caricare il modello corretto ed evitare modifiche accidentali.",
          "steps": [
            "Apri l’Academy una volta, poi passa alla Calcolatrice.",
            "Carica Piano attuale solo per il lancio Terra Bruna / Bianco Avorio.",
            "Apri la Panoramica e leggi gli avvisi della campanella.",
            "Salva un backup JSON prima di modificare qualunque dato."
          ],
          "warning": "Non iniziare da prezzo, lotto, IVA o prestito. Prima devi capire lo scenario attivo.",
          "action": "Carica Piano attuale, poi apri Panoramica.",
          "tab": "overview",
          "route": "calculator",
          "preset": "currentPlan",
          "badge": "INIZIA QUI"
        },
        {
          "title": "Cosa si può modificare in sicurezza",
          "purpose": "Scopo: distinguere le modifiche sicure da quelle strategiche.",
          "steps": [
            "Sostituisci costi provvisori con preventivi reali.",
            "Aggiorna stato del preventivo e note.",
            "Inserisci fornitore, data, quantità e fonte.",
            "Esporta JSON e CSV dopo ogni aggiornamento importante."
          ],
          "warning": "Un numero senza fonte diventa pericoloso, anche quando oggi sembra corretto.",
          "action": "Apri Costi fissi e controlla le voci ancora provvisorie.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Cosa non va modificato autonomamente",
          "purpose": "Scopo: proteggere le ipotesi strategiche.",
          "steps": [
            "Non modificare il prezzo retail senza approvazione della direzione.",
            "Non cambiare regime fiscale senza decisione del commercialista.",
            "Non cambiare importo del prestito in uno scenario serio senza approvazione.",
            "Non segnare nulla come Finale senza conferma scritta."
          ],
          "warning": "Lo scenario ufficiale non è un campo prove. Se devi sperimentare, salva prima un backup.",
          "action": "Apri Archivio e salva un backup prima di testare modifiche.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "L’ordine corretto di utilizzo",
          "purpose": "Scopo: seguire sempre la stessa sequenza operativa.",
          "steps": [
            "Carica Piano attuale o un backup datato.",
            "Controlla campanella e Rischio.",
            "Aggiorna solo numeri documentati.",
            "Rivedi Sensibilità e Confronto lotti.",
            "Esporta backup e riferisci cosa è cambiato."
          ],
          "warning": "Saltare l’ordine crea confusione: un costo modificato senza backup non è una traccia operativa.",
          "action": "Apri Rischio, poi torna in Archivio per un backup datato.",
          "tab": "risk",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "playbooks",
      "type": "playbook",
      "title": "II · Procedure operative",
      "description": "Usa queste procedure quando arriva un compito reale. Non improvvisare.",
      "lessons": [
        {
          "title": "Ho ricevuto un preventivo fornitore",
          "purpose": "Scopo: inserire un preventivo senza corrompere il modello.",
          "steps": [
            "Carica Piano attuale o il backup corretto.",
            "Vai all’area giusta: Economia unitaria o Costi fissi.",
            "Inserisci importo e quantità quotata.",
            "Scrivi fornitore, data, quantità e se il preventivo è scritto o verbale.",
            "Salva un backup JSON."
          ],
          "warning": "Non usare un preventivo da 50 unità dentro uno scenario da 15 senza una nota chiara.",
          "action": "Carica Piano attuale e apri Economia unitaria.",
          "tab": "unit",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Devo aggiornare il costo del packaging",
          "purpose": "Scopo: evitare la trappola del MOQ packaging.",
          "steps": [
            "Apri Economia unitaria.",
            "Controlla MOQ packaging, Scatole ordinate e Costo / scatola.",
            "Verifica che le scatole non siano meno delle sciarpe.",
            "Leggi eventuale carenza packaging e capitale immobilizzato.",
            "Salva un backup dopo l’aggiornamento."
          ],
          "warning": "Una scatola bella può comunque bloccare cassa. Il packaging deve servire la prova, non consumarla.",
          "action": "Apri Economia unitaria e controlla i campi packaging.",
          "tab": "unit",
          "route": "calculator"
        },
        {
          "title": "Devo capire se il Piano attuale è sostenibile",
          "purpose": "Scopo: fare una verifica rapida senza linguaggio finanziario inutile.",
          "steps": [
            "Carica Piano attuale.",
            "Apri Panoramica e leggi Fabbisogno massimo di cassa.",
            "Apri Rischio e guarda le voci rosse.",
            "Apri Confronto e valuta 15 / 30 / 50 / 75 / 100 unità.",
            "Non approvare se il pareggio supera il 100%."
          ],
          "warning": "Un piano che funziona solo con vendite perfette non è solido: è fragile.",
          "action": "Carica Piano attuale e apri Confronto.",
          "tab": "comparison",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Devo preparare un report di revisione",
          "purpose": "Scopo: inviare informazioni utili, non solo schermate.",
          "steps": [
            "Apri la campanella e annota gli avvisi.",
            "Esporta backup JSON.",
            "Esporta CSV.",
            "Apri Assistente e copia il pacchetto di revisione severa.",
            "Scrivi tre righe: cosa è cambiato, perché, quale rischio resta."
          ],
          "warning": "Gli screenshot non sono archivio. Un report serio include backup o riepilogo scenario.",
          "action": "Apri Assistente e copia il pacchetto di revisione.",
          "tab": null,
          "route": "assistant"
        },
        {
          "title": "Ho fatto un errore",
          "purpose": "Scopo: recuperare senza peggiorare la situazione.",
          "steps": [
            "Smetti subito di modificare.",
            "Non provare a ricostruire tutto a memoria.",
            "Apri Archivio.",
            "Carica l’ultimo backup corretto.",
            "Registra cosa è successo e quale backup è stato ripristinato."
          ],
          "warning": "Correggere a memoria di solito crea un secondo errore.",
          "action": "Apri Archivio e carica l’ultimo backup corretto.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "Non capisco un avviso",
          "purpose": "Scopo: trattare gli avvisi come soglie decisionali.",
          "steps": [
            "Apri la scheda Rischio.",
            "Leggi lentamente il messaggio.",
            "Trova il campo collegato nella Calcolatrice.",
            "Non superare l’avviso con ottimismo.",
            "Richiedi una revisione della direzione se l’effetto finanziario non è chiaro."
          ],
          "warning": "Un avviso non è decorazione. Indica debolezza strutturale o ipotesi non verificata.",
          "action": "Apri Rischio e identifica il primo avviso rosso.",
          "tab": "risk",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "concepts",
      "type": "concept",
      "title": "III · Concetti con esempi",
      "description": "Spiegazioni semplici dei numeri usati nella revisione settimanale.",
      "lessons": [
        {
          "title": "Costo reale unitario",
          "purpose": "Scopo: capire quanto costa davvero una sciarpa finita.",
          "steps": [
            "Parti dal costo di produzione.",
            "Aggiungi frangia, etichette, setup, tintura, spedizione in ingresso e packaging.",
            "Dividi per il lotto quando serve.",
            "Usa questo numero prima di giudicare il margine."
          ],
          "warning": "Il preventivo del fornitore non è il costo reale. È solo una parte del costo finale.",
          "action": "Apri Panoramica e leggi Costo reale unitario.",
          "tab": "overview",
          "route": "calculator"
        },
        {
          "title": "Sell-through e vendite mantenute",
          "purpose": "Scopo: distinguere interesse iniziale da vendite reali.",
          "steps": [
            "Se produci 20 sciarpe e ne vendi 10, il sell-through è 50%.",
            "Se 2 tornano indietro, le vendite mantenute sono 8.",
            "Il pareggio va giudicato dopo i resi.",
            "Nei piccoli lotti anche uno o due resi pesano molto."
          ],
          "warning": "Non dire ‘ne abbiamo vendute 10’ se due sono rientrate. Il modello guarda le vendite mantenute.",
          "action": "Apri Sensibilità e confronta diversi livelli di sell-through.",
          "tab": "comparison",
          "route": "calculator"
        },
        {
          "title": "Fabbisogno massimo di cassa",
          "purpose": "Scopo: sapere quanta cassa serve prima che entrino vendite.",
          "steps": [
            "Produzione può richiedere pagamento prima del lancio.",
            "Packaging può richiedere MOQ prima delle vendite.",
            "Fotografia e legale arrivano prima dei ricavi.",
            "Questo dato risponde: quanto profondo è il buco iniziale?"
          ],
          "warning": "Uno scenario può sembrare profittevole più avanti e fallire perché manca cassa all’inizio.",
          "action": "Apri Panoramica e leggi Fabbisogno massimo di cassa.",
          "tab": "overview",
          "route": "calculator"
        },
        {
          "title": "Pareggio",
          "purpose": "Scopo: sapere quante vendite mantenute servono per non perdere denaro.",
          "steps": [
            "Il pareggio non è un obiettivo romantico.",
            "È il minimo per coprire i costi.",
            "Lo strumento mostra anche le vendite iniziali richieste dopo i resi.",
            "Se il pareggio supera il lotto, lo scenario non funziona."
          ],
          "warning": "Non approvare uno scenario che ha bisogno di condizioni perfette.",
          "action": "Apri Rischio e leggi la sostenibilità strutturale.",
          "tab": "risk",
          "route": "calculator"
        },
        {
          "title": "MOQ packaging",
          "purpose": "Scopo: capire perché il packaging può deformare il budget.",
          "steps": [
            "MOQ significa quantità minima d’ordine.",
            "Un lancio da 15 sciarpe può richiedere 30, 50 o 100 scatole.",
            "Scatole extra immobilizzano cassa prima di creare valore.",
            "Se le scatole manuali sono meno delle sciarpe, appare un avviso."
          ],
          "warning": "Non abbassare il numero di scatole solo per rendere lo scenario più economico.",
          "action": "Apri Economia unitaria e controlla MOQ e Scatole ordinate.",
          "tab": "unit",
          "route": "calculator"
        },
        {
          "title": "Debito, capitale e liquidità",
          "purpose": "Scopo: separare prestito e profitto.",
          "steps": [
            "Il prestito può finanziare i costi.",
            "Gli interessi sono il costo del denaro preso in prestito.",
            "Il rimborso del capitale consuma cassa futura.",
            "La posizione finanziata non è la stessa cosa del profitto."
          ],
          "warning": "Il denaro preso in prestito può far sembrare forte il conto mentre il modello resta debole.",
          "action": "Apri Prestito & Capitale e leggi le metriche di finanziamento.",
          "tab": "loan",
          "route": "calculator"
        },
        {
          "title": "Regime Forfettario",
          "purpose": "Scopo: evitare ipotesi IVA false.",
          "steps": [
            "Nel Forfettario normalmente non si usa IVA sulle vendite in questo modello.",
            "L’app non calcola imposta sul reddito.",
            "L’app non calcola INPS.",
            "Il commercialista deve confermare il trattamento fiscale prima delle decisioni."
          ],
          "warning": "Non trattare il Risultato di cassa come denaro disponibile per il fondatore.",
          "action": "Apri Lancio e controlla il regime fiscale.",
          "tab": "launch",
          "route": "calculator"
        },
        {
          "title": "Contingenza",
          "purpose": "Scopo: proteggere il piano da piccoli errori.",
          "steps": [
            "La contingenza è una riserva, non denaro libero.",
            "Serve per incertezza su preventivi, spedizioni, campioni o difetti.",
            "Non spenderla in estetica.",
            "Quando i preventivi diventano reali, si può rivedere."
          ],
          "warning": "Togliere la contingenza per far sembrare elegante il piano è autoinganno finanziario.",
          "action": "Apri Economia unitaria e rivedi Contingenza %.",
          "tab": "unit",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "discipline",
      "type": "discipline",
      "title": "IV · Disciplina di lancio Moscatelli",
      "description": "Le regole per usare lo strumento durante la prova delle sciarpe.",
      "lessons": [
        {
          "title": "Routine quotidiana del Piano attuale",
          "purpose": "Scopo: usare Piano attuale come punto di partenza sicuro.",
          "steps": [
            "Carica Piano attuale solo per Terra Bruna / Bianco Avorio.",
            "Controlla i valori provvisori prima di modificare.",
            "Aggiorna una sola ipotesi alla volta.",
            "Salva backup dopo la modifica.",
            "Segnala l’effetto finanziario per la revisione della direzione."
          ],
          "warning": "Piano attuale non è verità. È il modello di lavoro finché preventivi, campioni e vendite non lo provano.",
          "action": "Carica Piano attuale e apri Panoramica.",
          "tab": "overview",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Disciplina dei preventivi",
          "purpose": "Scopo: rendere tracciabile ogni numero del fornitore.",
          "steps": [
            "Registra nome del fornitore.",
            "Registra data e quantità quotata.",
            "Indica se il preventivo è scritto o verbale.",
            "Non combinare quantità diverse senza nota."
          ],
          "warning": "Una nota pulita vale più di una stima elegante.",
          "action": "Apri Costi fissi e rivedi note/stato.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Approvazione campione",
          "purpose": "Scopo: proteggere la qualità fisica dall’ottimismo del foglio.",
          "steps": [
            "Il campione va visto fisicamente.",
            "Colore, mano, caduta, frangia e fit packaging contano.",
            "Non segnare Approvato da foto soltanto.",
            "Non trattare mockup digitali come prova produttiva."
          ],
          "warning": "Il lusso si perde quando il foglio approva ciò che la mano non ha testato.",
          "action": "Apri Costi fissi e controlla le verifiche obbligatorie.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Disciplina fotografica",
          "purpose": "Scopo: classificare correttamente la spesa visiva.",
          "steps": [
            "La fotografia può essere Essenziale se sostiene conversione e documentazione.",
            "Video e atmosfera possono aspettare se la cassa è stretta.",
            "Le immagini devono corrispondere al prodotto reale.",
            "Non lasciare che la bellezza visiva superi la prova fisica."
          ],
          "warning": "Immagini più belle della sciarpa reale creano delusione futura.",
          "action": "Apri Costi fissi e rivedi costo/stato fotografia.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Soglia decisionale per il debito",
          "purpose": "Scopo: impedire che il debito nasconda economia debole.",
          "steps": [
            "Controlla prima fabbisogno di cassa.",
            "Controlla pareggio con prestito.",
            "Controlla sensibilità al 50% e 75%.",
            "Conferma che i preventivi siano reali.",
            "Non discutere debito se il modello fallisce sotto stress."
          ],
          "warning": "Se il debito funziona solo nel caso più ottimistico, è pressione, non finanziamento.",
          "action": "Apri Prestito & Capitale, poi Confronto.",
          "tab": "loan",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "reference",
      "type": "reference",
      "title": "V · Checklist e glossario",
      "description": "Riferimento breve per attività ricorrenti.",
      "lessons": [
        {
          "title": "Prima di modificare un numero",
          "purpose": "Scopo: non danneggiare il file di lavoro.",
          "steps": [
            "Conferma lo scenario corretto.",
            "Salva prima un backup.",
            "Capisci se il valore è preventivo, stima o costo pagato.",
            "Scrivi la fonte nelle Note."
          ],
          "warning": "Numeri senza fonte diventano inaffidabili molto in fretta.",
          "action": "Apri Archivio e salva un backup.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "Prima di inviare per revisione",
          "purpose": "Scopo: inviare un report operativo utile.",
          "steps": [
            "Controlla gli avvisi della campanella.",
            "Apri Rischio e annota gli avvisi rossi.",
            "Esporta JSON e CSV.",
            "Copia il pacchetto di revisione dall’Assistente.",
            "Scrivi cosa è cambiato in linguaggio semplice."
          ],
          "warning": "Non inviare solo screenshot. Gli screenshot non preservano il modello.",
          "action": "Apri Assistente e copia il pacchetto di revisione.",
          "tab": null,
          "route": "assistant"
        },
        {
          "title": "Glossario essenziale",
          "purpose": "Scopo: definire i termini senza teatro finanziario.",
          "steps": [
            "COGS: costo dei beni venduti.",
            "Costo reale: costo fisico dell’unità finita, compresi packaging e ingresso.",
            "Fabbisogno di cassa: cassa massima richiesta prima delle vendite.",
            "Sell-through: percentuale venduta inizialmente.",
            "Vendite mantenute: vendite rimaste dopo i resi.",
            "MOQ: quantità minima d’ordine.",
            "Contingenza: riserva per incertezza, non denaro libero."
          ],
          "warning": "Se un termine non è chiaro, fermati. Non modificare l’ipotesi finché non lo capisci.",
          "action": "Usa prima Academy, poi Calcolatrice.",
          "tab": null,
          "route": "academy"
        },
        {
          "title": "Abitudini vietate",
          "purpose": "Scopo: eliminare i comportamenti più pericolosi.",
          "steps": [
            "Non cambiare regime fiscale con leggerezza.",
            "Non abbassare costi per far sembrare migliore lo scenario.",
            "Non segnare valori provvisori come finali.",
            "Non ignorare avvisi rossi.",
            "Non usare screenshot come unico archivio."
          ],
          "warning": "Lo strumento protegge Moscatelli solo se l’operatore rispetta le prove.",
          "action": "Apri Rischio e verifica che nessun avviso rosso sia ignorato.",
          "tab": "risk",
          "route": "calculator"
        },
        {
          "title": "Quando fermarsi e chiedere",
          "purpose": "Scopo: definire il punto di escalation.",
          "steps": [
            "Fermati se un numero cambia la decisione.",
            "Fermati se un preventivo contraddice Piano attuale.",
            "Fermati se entrano IVA, INPS o imposte.",
            "Fermati se il modello dice che il debito è impossibile."
          ],
          "warning": "Chiedere presto non è debolezza. Evita correzioni costose dopo.",
          "action": "Apri Assistente e copia il riepilogo scenario.",
          "tab": null,
          "route": "assistant"
        }
      ]
    }
  ],
  "pt": [
    {
      "id": "start",
      "type": "start",
      "title": "I · Comece por aqui",
      "description": "Caminho inicial. Leia antes de alterar qualquer número.",
      "lessons": [
        {
          "title": "Seus primeiros 10 minutos",
          "purpose": "Objetivo: abrir o sistema, carregar o modelo certo e evitar alterações acidentais.",
          "steps": [
            "Abra a Academia uma vez, depois vá para a Calculadora.",
            "Carregue Plano atual apenas para o lançamento Terra Bruna / Bianco Avorio.",
            "Abra a Visão geral e leia os alertas do sino.",
            "Salve um backup JSON antes de mudar qualquer dado."
          ],
          "warning": "Não comece alterando preço, lote, IVA ou empréstimo. Primeiro entenda o cenário ativo.",
          "action": "Carregue Plano atual e abra Visão geral.",
          "tab": "overview",
          "route": "calculator",
          "preset": "currentPlan",
          "badge": "COMECE AQUI"
        },
        {
          "title": "O que pode ser alterado com segurança",
          "purpose": "Objetivo: separar edições seguras de decisões estratégicas.",
          "steps": [
            "Substitua custos provisórios por orçamentos reais.",
            "Atualize status do orçamento e notas.",
            "Inclua fornecedor, data, quantidade e fonte.",
            "Exporte JSON e CSV após atualizações importantes."
          ],
          "warning": "Um número sem fonte vira perigoso depois, mesmo que hoje esteja correto.",
          "action": "Abra Custos fixos e veja quais itens ainda são provisórios.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "O que não deve ser alterado sem revisão",
          "purpose": "Objetivo: proteger as premissas estratégicas.",
          "steps": [
            "Não altere o preço de venda sem aprovação da direção.",
            "Não altere regime fiscal sem decisão do contador/commercialista.",
            "Não altere valor de empréstimo em cenário sério sem aprovação.",
            "Não marque nada como Final sem confirmação escrita."
          ],
          "warning": "O cenário oficial não é lugar para testes. Para testar, salve um backup antes.",
          "action": "Abra Arquivo e salve um backup antes de testar mudanças.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "A ordem correta de uso",
          "purpose": "Objetivo: seguir sempre a mesma sequência operacional.",
          "steps": [
            "Carregue Plano atual ou um backup datado.",
            "Confira sino e Risco.",
            "Atualize apenas números documentados.",
            "Revise Sensibilidade e Comparação.",
            "Exporte backup e informe o que mudou."
          ],
          "warning": "Pular a ordem cria confusão: custo alterado sem backup não é registro operacional.",
          "action": "Abra Risco e depois volte ao Arquivo para salvar backup datado.",
          "tab": "risk",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "playbooks",
      "type": "playbook",
      "title": "II · Procedimentos práticos",
      "description": "Use estes passos quando uma tarefa real aparecer. Não improvise.",
      "lessons": [
        {
          "title": "Recebi um orçamento de fornecedor",
          "purpose": "Objetivo: inserir um orçamento sem corromper o modelo.",
          "steps": [
            "Carregue Plano atual ou o backup correto.",
            "Vá para a área certa: Economia unitária ou Custos fixos.",
            "Insira valor e quantidade cotada.",
            "Escreva fornecedor, data, quantidade e se o orçamento é escrito ou verbal.",
            "Salve um backup JSON."
          ],
          "warning": "Não use orçamento de 50 unidades em cenário de 15 sem uma nota clara explicando a diferença.",
          "action": "Carregue Plano atual e abra Economia unitária.",
          "tab": "unit",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Preciso atualizar custo de embalagem",
          "purpose": "Objetivo: evitar a armadilha do MOQ de embalagem.",
          "steps": [
            "Abra Economia unitária.",
            "Confira MOQ de embalagem, Caixas pedidas e Custo / caixa.",
            "Confirme que há caixas para todas as peças.",
            "Leia falta de caixas e dinheiro preso em caixas extras.",
            "Salve backup depois da atualização."
          ],
          "warning": "Uma caixa bonita ainda pode prender caixa. Embalagem deve servir à prova, não consumi-la.",
          "action": "Abra Economia unitária e confira os campos de embalagem.",
          "tab": "unit",
          "route": "calculator"
        },
        {
          "title": "Preciso saber se o Plano atual é viável",
          "purpose": "Objetivo: fazer uma checagem rápida sem linguagem financeira pesada.",
          "steps": [
            "Carregue Plano atual.",
            "Abra Visão geral e leia Necessidade máxima de caixa.",
            "Abra Risco e veja os itens vermelhos.",
            "Abra Comparação e avalie 15 / 30 / 50 / 75 / 100 unidades.",
            "Não aprove se o ponto de equilíbrio passar de 100%."
          ],
          "warning": "Um plano que só funciona com vendas perfeitas não é seguro: é frágil.",
          "action": "Carregue Plano atual e abra Comparação.",
          "tab": "comparison",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Preciso preparar um relatório de revisão",
          "purpose": "Objetivo: enviar informação útil, não apenas prints.",
          "steps": [
            "Abra o sino e anote os alertas.",
            "Exporte o backup JSON.",
            "Exporte o CSV.",
            "Abra Assistente e copie o pacote de revisão severa.",
            "Escreva três linhas: o que mudou, por quê, qual risco permanece."
          ],
          "warning": "Print não é arquivo de trabalho. Relatório sério inclui backup ou resumo do cenário.",
          "action": "Abra Assistente e copie o pacote de revisão.",
          "tab": null,
          "route": "assistant"
        },
        {
          "title": "Cometi um erro",
          "purpose": "Objetivo: recuperar sem piorar o problema.",
          "steps": [
            "Pare de editar imediatamente.",
            "Não tente reconstruir tudo de memória.",
            "Abra Arquivo.",
            "Carregue o último backup correto.",
            "Registre o que aconteceu e qual backup foi restaurado."
          ],
          "warning": "Consertar de memória costuma criar um segundo erro.",
          "action": "Abra Arquivo e carregue o último backup correto.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "Não entendi um alerta",
          "purpose": "Objetivo: tratar alertas como pontos de decisão.",
          "steps": [
            "Abra a aba Risco.",
            "Leia a frase com calma.",
            "Encontre o campo relacionado na Calculadora.",
            "Não passe por cima do alerta com otimismo.",
            "Peça revisão da direção se o impacto financeiro não estiver claro."
          ],
          "warning": "Alerta não é decoração. Ele mostra fraqueza estrutural ou premissa não verificada.",
          "action": "Abra Risco e identifique o primeiro alerta vermelho.",
          "tab": "risk",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "concepts",
      "type": "concept",
      "title": "III · Conceitos com exemplos",
      "description": "Explicações simples dos números usados na revisão semanal.",
      "lessons": [
        {
          "title": "Custo real unitário",
          "purpose": "Objetivo: entender quanto custa uma peça finalizada.",
          "steps": [
            "Comece pelo custo de produção.",
            "Some franja, etiquetas, setup, tingimento, frete de entrada e embalagem.",
            "Divida pelo lote quando necessário.",
            "Use esse número antes de julgar margem."
          ],
          "warning": "Orçamento do fornecedor não é custo real. É só uma parte do custo final.",
          "action": "Abra Visão geral e leia Custo real unitário.",
          "tab": "overview",
          "route": "calculator"
        },
        {
          "title": "Sell-through e vendas mantidas",
          "purpose": "Objetivo: separar interesse inicial de venda real mantida.",
          "steps": [
            "Se 20 peças são produzidas e 10 vendem, sell-through é 50%.",
            "Se 2 são devolvidas, vendas mantidas são 8.",
            "O equilíbrio deve ser julgado depois das devoluções.",
            "Em lote pequeno, uma ou duas devoluções pesam muito."
          ],
          "warning": "Não diga ‘vendemos 10’ se duas voltaram. O modelo olha vendas mantidas.",
          "action": "Abra Sensibilidade e compare vários níveis de sell-through.",
          "tab": "comparison",
          "route": "calculator"
        },
        {
          "title": "Necessidade máxima de caixa",
          "purpose": "Objetivo: saber quanto dinheiro precisa existir antes das vendas entrarem.",
          "steps": [
            "Produção pode ser paga antes do lançamento.",
            "Embalagem pode exigir MOQ antes das vendas.",
            "Fotografia e jurídico vêm antes da receita.",
            "Esse número responde: qual é o buraco inicial?"
          ],
          "warning": "Um cenário pode parecer lucrativo depois e falhar por falta de caixa no começo.",
          "action": "Abra Visão geral e leia Necessidade máxima de caixa.",
          "tab": "overview",
          "route": "calculator"
        },
        {
          "title": "Ponto de equilíbrio",
          "purpose": "Objetivo: saber quantas vendas mantidas são necessárias para não perder dinheiro.",
          "steps": [
            "Equilíbrio não é meta bonita.",
            "É o mínimo para cobrir custos.",
            "O sistema também mostra vendas iniciais exigidas depois das devoluções.",
            "Se o equilíbrio passa do lote, o cenário não funciona."
          ],
          "warning": "Não aprove cenário que depende de condições perfeitas.",
          "action": "Abra Risco e leia a viabilidade estrutural.",
          "tab": "risk",
          "route": "calculator"
        },
        {
          "title": "MOQ de embalagem",
          "purpose": "Objetivo: entender por que embalagem pode distorcer o orçamento.",
          "steps": [
            "MOQ é quantidade mínima de pedido.",
            "Um lançamento de 15 peças pode exigir 30, 50 ou 100 caixas.",
            "Caixas extras prendem dinheiro antes de gerar valor.",
            "Se caixas manuais forem menores que o lote, o sistema avisa."
          ],
          "warning": "Não reduza caixas só para o cenário parecer mais barato.",
          "action": "Abra Economia unitária e confira MOQ e Caixas pedidas.",
          "tab": "unit",
          "route": "calculator"
        },
        {
          "title": "Dívida, capital e liquidez",
          "purpose": "Objetivo: separar empréstimo de lucro.",
          "steps": [
            "Empréstimo pode financiar custos.",
            "Juros são o custo do dinheiro emprestado.",
            "Pagamento do principal consome caixa futura.",
            "Posição financiada não é o mesmo que lucro."
          ],
          "warning": "Dinheiro emprestado pode deixar a conta bonita enquanto o modelo continua fraco.",
          "action": "Abra Empréstimo & Capital e leia as métricas de financiamento.",
          "tab": "loan",
          "route": "calculator"
        },
        {
          "title": "Regime Forfettario",
          "purpose": "Objetivo: evitar premissas falsas de IVA.",
          "steps": [
            "No Forfettario normalmente não se usa IVA de venda neste modelo.",
            "O app não calcula imposto de renda.",
            "O app não calcula INPS.",
            "O contador/commercialista deve confirmar antes de decisões."
          ],
          "warning": "Nunca trate Resultado de caixa como dinheiro disponível para o fundador.",
          "action": "Abra Lançamento e confirme o regime fiscal.",
          "tab": "launch",
          "route": "calculator"
        },
        {
          "title": "Contingência",
          "purpose": "Objetivo: proteger o plano contra pequenos erros.",
          "steps": [
            "Contingência é reserva, não sobra.",
            "Serve para incerteza em orçamento, frete, amostra ou defeito.",
            "Não gaste em estética.",
            "Quando os orçamentos viram reais, ela pode ser revista."
          ],
          "warning": "Remover contingência para o plano parecer elegante é autoengano financeiro.",
          "action": "Abra Economia unitária e revise Contingência %.",
          "tab": "unit",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "discipline",
      "type": "discipline",
      "title": "IV · Disciplina do lançamento Moscatelli",
      "description": "Regras de uso durante a prova dos cachecóis.",
      "lessons": [
        {
          "title": "Rotina diária do Plano atual",
          "purpose": "Objetivo: usar Plano atual como ponto de partida seguro.",
          "steps": [
            "Carregue Plano atual apenas para Terra Bruna / Bianco Avorio.",
            "Confira valores provisórios antes de editar.",
            "Atualize uma premissa por vez.",
            "Salve backup depois da mudança.",
            "Informe o efeito financeiro para revisão da direção."
          ],
          "warning": "Plano atual não é verdade. É o modelo de trabalho até orçamento, amostra e venda provarem o contrário.",
          "action": "Carregue Plano atual e abra Visão geral.",
          "tab": "overview",
          "route": "calculator",
          "preset": "currentPlan"
        },
        {
          "title": "Disciplina de orçamento",
          "purpose": "Objetivo: tornar cada número de fornecedor rastreável.",
          "steps": [
            "Registre nome do fornecedor.",
            "Registre data e quantidade cotada.",
            "Diga se o orçamento é escrito ou verbal.",
            "Não combine quantidades diferentes sem nota."
          ],
          "warning": "Uma nota limpa vale mais que uma estimativa elegante.",
          "action": "Abra Custos fixos e revise notas/status.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Aprovação de amostra",
          "purpose": "Objetivo: proteger qualidade física contra otimismo de planilha.",
          "steps": [
            "A amostra precisa ser avaliada fisicamente.",
            "Cor, toque, caimento, franja e encaixe na embalagem importam.",
            "Não marque Aprovado só por fotos.",
            "Não trate mockup digital como prova produtiva."
          ],
          "warning": "O luxo se perde quando a planilha aprova o que a mão não testou.",
          "action": "Abra Custos fixos e confira as etapas de aprovação.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Disciplina de fotografia",
          "purpose": "Objetivo: classificar gasto visual corretamente.",
          "steps": [
            "Fotografia pode ser Essencial se ajuda conversão e documentação.",
            "Vídeo e atmosfera podem esperar se o caixa estiver apertado.",
            "As imagens devem corresponder ao produto real.",
            "Não deixe o visual superar a prova física."
          ],
          "warning": "Imagem mais bonita que o cachecol real cria decepção futura.",
          "action": "Abra Custos fixos e revise custo/status da fotografia.",
          "tab": "fixed",
          "route": "calculator"
        },
        {
          "title": "Ponto de decisão para dívida",
          "purpose": "Objetivo: impedir que empréstimo esconda economia fraca.",
          "steps": [
            "Confira primeiro a necessidade de caixa.",
            "Confira equilíbrio com empréstimo.",
            "Confira sensibilidade em 50% e 75%.",
            "Confirme que os orçamentos são reais.",
            "Não discuta dívida se o modelo falha sob pressão."
          ],
          "warning": "Se a dívida só funciona no cenário mais otimista, é pressão, não financiamento.",
          "action": "Abra Empréstimo & Capital e depois Comparação.",
          "tab": "loan",
          "route": "calculator"
        }
      ]
    },
    {
      "id": "reference",
      "type": "reference",
      "title": "V · Checklists e glossário",
      "description": "Referência curta para tarefas repetidas.",
      "lessons": [
        {
          "title": "Antes de alterar qualquer número",
          "purpose": "Objetivo: não danificar o arquivo de trabalho.",
          "steps": [
            "Confirme que está no cenário certo.",
            "Salve backup primeiro.",
            "Saiba se o valor é orçamento, estimativa ou custo pago.",
            "Escreva a fonte nas Notas."
          ],
          "warning": "Número sem fonte vira pouco confiável rapidamente.",
          "action": "Abra Arquivo e salve um backup.",
          "tab": "archive",
          "route": "calculator"
        },
        {
          "title": "Antes de enviar para revisão",
          "purpose": "Objetivo: enviar um relatório operacional útil.",
          "steps": [
            "Confira os alertas do sino.",
            "Abra Risco e anote alertas vermelhos.",
            "Exporte JSON e CSV.",
            "Copie o pacote de revisão no Assistente.",
            "Explique o que mudou em linguagem simples."
          ],
          "warning": "Não envie apenas prints. Prints não preservam o modelo.",
          "action": "Abra Assistente e copie o pacote de revisão.",
          "tab": null,
          "route": "assistant"
        },
        {
          "title": "Glossário essencial",
          "purpose": "Objetivo: definir os termos sem teatro financeiro.",
          "steps": [
            "COGS: custo dos produtos vendidos.",
            "Custo real: custo físico da unidade final, incluindo embalagem e entrada.",
            "Necessidade de caixa: caixa máximo exigido antes das vendas.",
            "Sell-through: percentual vendido inicialmente.",
            "Vendas mantidas: vendas que permanecem depois de devoluções.",
            "MOQ: quantidade mínima de pedido.",
            "Contingência: reserva para incerteza, não dinheiro livre."
          ],
          "warning": "Se um termo não está claro, pare. Não altere a premissa até entender.",
          "action": "Use primeiro a Academia, depois a Calculadora.",
          "tab": null,
          "route": "academy"
        },
        {
          "title": "Hábitos proibidos",
          "purpose": "Objetivo: eliminar os comportamentos mais perigosos.",
          "steps": [
            "Não altere regime fiscal casualmente.",
            "Não reduza custos para o cenário parecer melhor.",
            "Não marque valores provisórios como finais.",
            "Não ignore alertas vermelhos.",
            "Não use prints como único registro."
          ],
          "warning": "O sistema protege Moscatelli apenas se a operadora respeitar as evidências.",
          "action": "Abra Risco e confirme que nenhum alerta vermelho foi ignorado.",
          "tab": "risk",
          "route": "calculator"
        },
        {
          "title": "Quando parar e perguntar",
          "purpose": "Objetivo: definir o ponto de escalada.",
          "steps": [
            "Pare se um número muda a decisão.",
            "Pare se um orçamento contradiz o Plano atual.",
            "Pare se o assunto envolve IVA, INPS ou imposto.",
            "Pare se o modelo disser que a dívida é impossível."
          ],
          "warning": "Perguntar cedo não é fraqueza. Evita correções caras depois.",
          "action": "Abra Assistente e copie o resumo do cenário.",
          "tab": null,
          "route": "assistant"
        }
      ]
    }
  ]
};

function renderAcademy() {
  const root = $('academyModules');
  if (!root) return;

  const curriculum = academyCurriculum[state.uiLang] || academyCurriculum.en;
  const actionText = t('academy_open_tab');
  const currentPlanText = t('k_currentPlan');

  root.innerHTML = curriculum.map((module, moduleIndex) => `
    <details class="academy-module academy-module--manual academy-module--${escapeHtml(module.type || module.id)}" ${moduleIndex === 0 ? 'open' : ''}>
      <summary>
        <span>${escapeHtml(module.title)}</span>
        <small>${escapeHtml(module.description)}</small>
      </summary>
      <div class="academy-lesson-list">
        ${module.lessons.map((lesson, lessonIndex) => `
          <article class="lesson lesson--manual ${lesson.badge ? 'lesson--start' : ''}">
            <div class="lesson-number">${moduleIndex + 1}.${lessonIndex + 1}</div>
            <div class="lesson-content">
              ${lesson.badge ? `<div class="lesson-start-badge">${escapeHtml(lesson.badge)}</div>` : ''}
              <h3>${escapeHtml(lesson.title)}</h3>
              <p class="lesson-purpose">${escapeHtml(lesson.purpose)}</p>
              <div class="lesson-section">
                <strong>${escapeHtml(academyLabel('steps'))}</strong>
                <ol>${lesson.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
              </div>
              <div class="lesson-warning">
                <strong>${escapeHtml(academyLabel('warning'))}</strong>
                <span>${escapeHtml(lesson.warning)}</span>
              </div>
              <div class="lesson-action">
                <strong>${escapeHtml(academyLabel('action'))}</strong>
                <span>${escapeHtml(lesson.action)}</span>
              </div>
              <div class="academy-actions">
                ${lesson.preset ? `<button class="btn small primary academy-preset" data-academy-preset="${escapeHtml(lesson.preset)}">${escapeHtml(currentPlanText)}</button>` : ''}
                <button class="btn small academy-jump" data-academy-route="${escapeHtml(lesson.route || 'calculator')}" data-open-tab="${escapeHtml(lesson.tab || '')}">${escapeHtml(actionText)}</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </details>
  `).join('');

  root.querySelectorAll('.academy-preset').forEach(btn => btn.addEventListener('click', () => {
    preset(btn.dataset.academyPreset);
    location.hash = 'calculator';
    openCalcTab('overview');
  }));

  root.querySelectorAll('.academy-jump').forEach(btn => btn.addEventListener('click', () => {
    const routeName = btn.dataset.academyRoute || 'calculator';
    location.hash = routeName;
    if (routeName === 'calculator' && btn.dataset.openTab) openCalcTab(btn.dataset.openTab);
  }));
}

function academyLabel(key) {
  const labels = {
    en: { steps: 'Do this', warning: 'Do not miss this', action: 'Next action' },
    it: { steps: 'Fai così', warning: 'Da non ignorare', action: 'Prossima azione' },
    pt: { steps: 'Faça assim', warning: 'Não ignore', action: 'Próxima ação' }
  };
  return (labels[state.uiLang] || labels.en)[key] || key;
}

function openCalcTab(tab) {
  document.querySelectorAll('[data-calctab]').forEach(btn => {
    const active = btn.dataset.calctab === tab;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-calctab-panel]').forEach(panel => {
    panel.classList.toggle('is-active', panel.dataset.calctabPanel === tab);
  });
}

function route() {
  const requested = (location.hash || '#threshold').replace('#', '');
  const name = validRoutes.includes(requested) ? requested : 'threshold';
  if (requested !== name) location.hash = name;
  document.querySelectorAll('.route-section').forEach(s => s.classList.toggle('is-active', s.dataset.section === name));
  document.querySelectorAll('[data-route]').forEach(a => {
    const active = a.dataset.route === name;
    a.classList.toggle('is-active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (name === 'assistant') toggleAssistant(true);
}



// v4.8 — Contextual calculator help with examples. This is presentation-only; it does not touch calculation logic.
const contextualHelp = {
  en: {
    section_overview: ['Overview', 'Read this before editing. It shows whether the current scenario survives cash, debt, and sell-through pressure.'],
    section_launch: ['Launch assumptions', 'Set the commercial frame: price, batch, fiscal mode, sell-through, and payment fees. Avoid hopeful numbers.'],
    section_unit: ['Unit economics', 'These costs scale with the batch. This is where production, packaging, returns, defects, and contingency are controlled.'],
    section_fixed: ['Fixed expenses', 'Use this for costs that do not scale directly with each scarf: samples, photography, legal, website, travel, and admin.'],
    section_loan: ['Loan and capital', 'Use this to test debt pressure. A loan is liquidity; it is not profit.'],
    section_risk: ['Risk dashboard', 'This section translates the model into warnings. Red signals must be solved before serious spending.'],
    section_sensitivity: ['Sensitivity', 'Shows what happens at different sell-through levels. Use it to avoid building a plan around 100% sales.'],
    section_comparison: ['Batch comparison', 'Compares 15, 30, 50, 75, and 100 units using the same assumptions. This exposes scale risk.'],
    section_archive: ['Archive', 'Save JSON backups before important edits. CSV is for review; JSON is for restoring the workstation.'],
    cashDrawdown: ['Max cash drawdown', 'The cash needed before sales arrive. If this exceeds available funds, the plan fails before launch.'],
    landedCost: ['True landed cost', 'The cost of one finished, packaged scarf before overhead. It is not just the mill quote.'],
    netRevenue: ['Net revenue', 'Customer money after VAT treatment, returns, and payment fees. This is not final profit.'],
    cashResult: ['Cash result', 'Net revenue minus modelled launch costs, before full loan repayment and before taxes.'],
    afterLoan: ['After full loan repayment', 'A severe view: batch result after repaying principal and interest. Useful, but conservative.'],
    breakEvenSellThrough: ['Break-even sell-through', 'The initial sales level needed to cover costs, adjusted for returns. Over 100% means the scenario cannot work as written.'],
    scenarioName: ['Scenario name', 'Name the model clearly so backups can be understood later. Avoid vague names like “test”.'],
    scenarioStatus: ['Scenario status', 'Use Draft for assumptions, Quote-based for supplier figures, and Final only when approved.'],
    fiscalMode: ['Fiscal mode', 'Forfettario normally means no sales VAT and no input VAT recovery. Confirm treatment with a commercialista.'],
    retailPrice: ['Retail price', 'The customer price per scarf. Do not change this casually; it affects positioning and break-even.'],
    batchSize: ['Batch size', 'How many scarves are produced. Changing this automatically changes production and packaging exposure.'],
    sellThrough: ['Sell-through', 'The percentage expected to sell initially. Keep this conservative and test several scenarios.'],
    salesVatRate: ['Sales VAT rate', 'Only relevant outside the no-VAT model. Under Forfettario this is locked to zero.'],
    salesVatMode: ['Retail price VAT', 'Defines whether VAT is included, excluded, or not modelled. Wrong settings distort revenue.'],
    paymentFee: ['Payment fee', 'Percentage taken by Stripe, Shopify, PayPal, or another payment processor.'],
    fixedFee: ['Fixed fee per sale', 'Small fixed processor charge per order. It matters more in small batches.'],
    shippingCharged: ['Shipping charged', 'What the customer pays for shipping. If zero, shipping must be absorbed elsewhere.'],
    productionUnitCost: ['Production per scarf', 'Supplier production cost per scarf before premiums and extras. Replace with real quote only.'],
    smallBatchPremium: ['Small-batch premium', 'Extra percentage for tiny runs. Keep it realistic until a supplier removes it.'],
    setupFee: ['Mill setup fee', 'One-off production setup cost. It hurts small batches because it spreads over few units.'],
    dyeingSurcharge: ['Dyeing surcharge', 'Colour development or dyeing cost per colour. Terra Bruna and Bianco Avorio may each matter.'],
    colourCount: ['Colour count', 'Number of colourways in the batch. More colours can raise setup and dyeing exposure.'],
    fringeCost: ['Fringe finishing', 'Extra finishing cost for controlled fringe execution. Do not hide it inside vague production assumptions.'],
    labelCost: ['Label and care tag', 'Cost of woven label, care label, and related product identification.'],
    inboundShipping: ['Inbound shipping', 'Movement from supplier to Moscatelli before customer fulfilment.'],
    packagingMode: ['Box order rule', 'Auto protects the batch/MOQ logic. Manual is only for deliberate packaging tests.'],
    packagingMoq: ['Packaging MOQ', 'Minimum box order. This is a cash trap if boxes greatly exceed scarf quantity.'],
    boxesOrdered: ['Boxes ordered', 'Manual box quantity. If lower than batch size, the workstation will warn you.'],
    boxCost: ['Cost per box', 'Per-unit packaging cost. Include box, tissue, envelope, seal, and inserts if possible.'],
    fulfilmentCost: ['Fulfilment materials', 'Packing materials used when an order is shipped. Separate this from the luxury box itself.'],
    outboundShipping: ['Outbound shipping', 'Cost to send each order to the customer if Moscatelli pays or subsidises shipping.'],
    returnRate: ['Return rate', 'Expected refunded orders. Returns reduce kept sales and raise the sell-through needed to break even.'],
    returnPenalty: ['Return / repack cost', 'Cost to inspect, re-pack, or write down a returned scarf.'],
    defectRate: ['Defect rate', 'Expected rejected or unsellable units. Small defects hurt small luxury batches severely.'],
    defectPenalty: ['Defect handling', 'Extra cost of handling defective units, beyond losing the sellable scarf.'],
    contingencyRate: ['Contingency', 'Safety reserve for unknown costs. Do not set to zero unless every quote is confirmed.'],
    item: ['Expense item', 'Name the cost clearly. Include supplier or purpose when possible.'],
    category: ['Expense category', 'Groups fixed costs for review. Use it to separate samples, photography, legal, and admin.'],
    priority: ['Priority', 'Essential means necessary. Vanity means delay unless it directly supports proof.'],
    status: ['Documentation status', 'Shows whether a number is placeholder, quote-based, approved, or paid.'],
    requiresApproval: ['Approval gate', 'Use this when leadership approval or a physical sample review is required before spending.'],
    qty: ['Quantity', 'Number of units for this fixed cost row.'],
    unitCost: ['Unit cost', 'Cost per unit for the row. VAT mode decides how gross is calculated.'],
    vatMode: ['Expense VAT mode', 'Use included, excluded, or no VAT according to the supplier quote. Do not guess.'],
    vatRateExpense: ['Expense VAT rate', 'VAT rate on the expense. Under Forfettario, input VAT is still a cash cost.'],
    notes: ['Notes', 'Record quote source, supplier, date, assumption, or risk. Future you will need the evidence.'],
    loanAmount: ['Loan amount', 'Capital borrowed. It may fund cash drawdown, but it must still be repaid.'],
    interestRate: ['Interest / APR', 'Annual interest rate used for the term calculation. It is a model, not a contract.'],
    loanTermMonths: ['Loan term', 'Months used to pro-rate interest. Short terms increase repayment pressure.'],
    bufferTarget: ['Cash buffer target', 'Recommended reserve on top of modelled costs. Serious launches need buffer.'],
    rail_netRevenue: ['Net revenue rail', 'Quick reference only. Open Overview for the detailed calculation.'],
    rail_cashResult: ['Cash result rail', 'Shows whether the scenario survives before loan repayment and taxes.'],
    rail_afterLoan: ['After loan rail', 'Severe shortcut for debt pressure. Check the Loan tab for nuance.'],
    rail_cashDrawdown: ['Cash drawdown rail', 'The immediate funding burden. Watch this before increasing batch size.'],
    rail_breakEven: ['Break-even rail', 'If this is above 100%, the scenario is structurally weak.'],
    rail_risk: ['Risk badge', 'Summary of the strongest warning. Open Risk for the full explanation.']
  },
  it: {
    section_overview: ['Sintesi', 'Da leggere prima di modificare. Mostra se lo scenario regge cassa, debito e sell-through.'],
    section_launch: ['Ipotesi di lancio', 'Definisce prezzo, lotto, regime fiscale, sell-through e commissioni. Evita numeri ottimistici.'],
    section_unit: ['Economia unitaria', 'Questi costi scalano con il lotto: produzione, packaging, resi, difetti e contingenza.'],
    section_fixed: ['Costi fissi', 'Usalo per campioni, fotografia, legale, sito, viaggi e amministrazione.'],
    section_loan: ['Prestito e capitale', 'Serve a testare la pressione del debito. Il prestito è liquidità, non profitto.'],
    section_risk: ['Cruscotto rischi', 'Traduce il modello in avvisi. I segnali rossi vanno risolti prima di spendere.'],
    section_sensitivity: ['Sensibilità', 'Mostra cosa accade con diversi livelli di sell-through. Non costruire il piano sul 100% venduto.'],
    section_comparison: ['Confronto lotti', 'Confronta 15, 30, 50, 75 e 100 unità con le stesse ipotesi.'],
    section_archive: ['Archivio', 'Salva backup JSON prima delle modifiche importanti. Il CSV serve per revisione; il JSON per ripristinare.'],
    cashDrawdown: ['Fabbisogno massimo di cassa', 'Cassa necessaria prima che arrivino vendite. Se supera i fondi disponibili, il piano fallisce prima del lancio.'],
    landedCost: ['Costo reale unitario', 'Costo di una sciarpa finita e confezionata prima dei costi generali. Non è solo il preventivo del produttore.'],
    netRevenue: ['Ricavo netto', 'Denaro cliente dopo trattamento IVA, resi e commissioni. Non è profitto finale.'],
    cashResult: ['Risultato di cassa', 'Ricavo netto meno costi di lancio modellati, prima del rimborso completo del prestito e delle imposte.'],
    afterLoan: ['Dopo rimborso completo', 'Vista severa: risultato del lotto dopo rimborso di capitale e interessi. Utile, ma conservativa.'],
    breakEvenSellThrough: ['Sell-through di pareggio', 'Vendite iniziali necessarie a coprire i costi, corrette per i resi. Oltre 100% non regge.'],
    scenarioName: ['Nome scenario', 'Dai un nome chiaro al modello così i backup restano comprensibili.'],
    scenarioStatus: ['Stato scenario', 'Usa Bozza per ipotesi, Preventivo per numeri da fornitori, Finale solo dopo approvazione.'],
    fiscalMode: ['Regime fiscale', 'Forfettario normalmente significa vendite senza IVA e IVA sugli acquisti non recuperabile. Verifica col commercialista.'],
    retailPrice: ['Prezzo retail', 'Prezzo cliente per sciarpa. Non modificarlo con leggerezza: influenza posizionamento e pareggio.'],
    batchSize: ['Dimensione lotto', 'Numero di sciarpe prodotte. Cambiarlo modifica automaticamente produzione e packaging.'],
    sellThrough: ['Sell-through', 'Percentuale prevista di vendite iniziali. Tienila prudente e testa più scenari.'],
    salesVatRate: ['IVA vendite', 'Rilevante solo fuori dal modello senza IVA. In Forfettario resta bloccata a zero.'],
    salesVatMode: ['IVA prezzo retail', 'Definisce se l’IVA è inclusa, esclusa o non modellata. Un’impostazione errata distorce il ricavo.'],
    paymentFee: ['Commissione pagamento', 'Percentuale trattenuta da Stripe, Shopify, PayPal o simili.'],
    fixedFee: ['Commissione fissa vendita', 'Piccola commissione fissa per ordine. Nei piccoli lotti pesa di più.'],
    shippingCharged: ['Spedizione addebitata', 'Quanto paga il cliente per la spedizione. Se è zero, Moscatelli assorbe il costo altrove.'],
    productionUnitCost: ['Produzione per sciarpa', 'Costo fornitore per sciarpa prima di premium ed extra. Sostituire solo con preventivo reale.'],
    smallBatchPremium: ['Premium piccolo lotto', 'Percentuale extra per tirature minuscole. Mantienila realistica finché il fornitore la elimina.'],
    setupFee: ['Setup produttore', 'Costo una tantum di avvio. Nei piccoli lotti pesa molto perché si divide su poche unità.'],
    dyeingSurcharge: ['Sovrapprezzo tintura', 'Costo colore o sviluppo tinta. Terra Bruna e Bianco Avorio possono pesare separatamente.'],
    colourCount: ['Numero colori', 'Numero di varianti colore. Più colori possono aumentare setup e tintura.'],
    fringeCost: ['Finitura frangia', 'Costo extra per una frangia controllata. Non nasconderlo in una voce vaga.'],
    labelCost: ['Etichetta e cura', 'Costo di etichetta, care label e identificazione del prodotto.'],
    inboundShipping: ['Spedizione in ingresso', 'Trasporto dal fornitore a Moscatelli prima dell’evasione cliente.'],
    packagingMode: ['Regola scatole', 'Auto protegge lotto e MOQ. Manuale solo per test deliberati di packaging.'],
    packagingMoq: ['MOQ packaging', 'Ordine minimo di scatole. È una trappola di cassa se supera molto le sciarpe.'],
    boxesOrdered: ['Scatole ordinate', 'Quantità manuale di scatole. Se è inferiore al lotto, il sistema avvisa.'],
    boxCost: ['Costo scatola', 'Costo per packaging. Includi scatola, carta, busta, sigillo e inserti se possibile.'],
    fulfilmentCost: ['Materiali evasione', 'Materiali usati per spedire l’ordine, separati dalla scatola di lusso.'],
    outboundShipping: ['Spedizione cliente', 'Costo per inviare ogni ordine al cliente se Moscatelli paga o sovvenziona.'],
    returnRate: ['Tasso resi', 'Ordini previsti come rimborsati. I resi riducono vendite trattenute e alzano il pareggio.'],
    returnPenalty: ['Costo reso/repack', 'Costo di controllo, riconfezionamento o svalutazione di una sciarpa resa.'],
    defectRate: ['Tasso difetti', 'Unità previste come scartate o invendibili. Nei piccoli lotti pesano moltissimo.'],
    defectPenalty: ['Gestione difetto', 'Costo extra per gestire difetti, oltre alla perdita dell’unità vendibile.'],
    contingencyRate: ['Contingenza', 'Riserva per costi ignoti. Non metterla a zero finché ogni preventivo è confermato.'],
    item: ['Voce costo', 'Nomina chiaramente il costo. Inserisci fornitore o finalità quando possibile.'],
    category: ['Categoria costo', 'Raggruppa i costi fissi per revisione: campioni, fotografia, legale, admin.'],
    priority: ['Priorità', 'Essenziale è necessario. Vanità va rimandato salvo supporti direttamente la prova.'],
    status: ['Stato documentazione', 'Indica se il numero è provvisorio, preventivo, approvato o pagato.'],
    requiresApproval: ['Verifica obbligatoria', 'Usalo quando serve approvazione della direzione o verifica fisica del campione prima di spendere.'],
    qty: ['Quantità', 'Numero di unità per questa riga di costo fisso.'],
    unitCost: ['Costo unitario', 'Costo per unità della riga. La modalità IVA decide il lordo.'],
    vatMode: ['IVA costo', 'Usa inclusa, esclusa o assente secondo il preventivo. Non indovinare.'],
    vatRateExpense: ['Aliquota IVA costo', 'Aliquota del costo. In Forfettario l’IVA sugli acquisti resta costo di cassa.'],
    notes: ['Note', 'Registra fonte, fornitore, data, ipotesi o rischio. Servirà come prova.'],
    loanAmount: ['Importo prestito', 'Capitale preso in prestito. Può finanziare la cassa, ma va rimborsato.'],
    interestRate: ['Interesse / TAEG', 'Tasso annuo usato per il calcolo temporale. È un modello, non un contratto.'],
    loanTermMonths: ['Durata prestito', 'Mesi usati per proporzionare l’interesse. Tempi brevi alzano la pressione.'],
    bufferTarget: ['Riserva cassa', 'Riserva raccomandata sopra i costi modellati. Un lancio serio ha bisogno di margine.'],
    rail_netRevenue: ['Ricavo netto rapido', 'Solo riferimento rapido. Apri Sintesi per il calcolo completo.'],
    rail_cashResult: ['Risultato cassa rapido', 'Mostra se lo scenario regge prima di prestito e imposte.'],
    rail_afterLoan: ['Dopo prestito rapido', 'Scorciatoia severa sulla pressione del debito. Apri Prestito per i dettagli.'],
    rail_cashDrawdown: ['Fabbisogno rapido', 'Il peso immediato di finanziamento. Guardalo prima di aumentare il lotto.'],
    rail_breakEven: ['Pareggio rapido', 'Se supera 100%, lo scenario è strutturalmente debole.'],
    rail_risk: ['Indicatore rischio', 'Riassume l’avviso più forte. Apri Rischio per la spiegazione completa.']
  },
  pt: {
    section_overview: ['Resumo', 'Leia antes de editar. Mostra se o cenário aguenta caixa, dívida e sell-through.'],
    section_launch: ['Premissas de lançamento', 'Define preço, lote, regime fiscal, sell-through e taxas. Evite números otimistas.'],
    section_unit: ['Economia unitária', 'Estes custos escalam com o lote: produção, embalagem, devoluções, defeitos e contingência.'],
    section_fixed: ['Custos fixos', 'Use para amostras, fotografia, jurídico, site, viagens e administração.'],
    section_loan: ['Empréstimo e capital', 'Serve para testar pressão de dívida. Empréstimo é liquidez, não lucro.'],
    section_risk: ['Painel de riscos', 'Traduz o modelo em alertas. Sinais vermelhos devem ser resolvidos antes de gastar.'],
    section_sensitivity: ['Sensibilidade', 'Mostra o efeito de diferentes níveis de sell-through. Não baseie o plano em 100% vendido.'],
    section_comparison: ['Comparação de lotes', 'Compara 15, 30, 50, 75 e 100 unidades com as mesmas premissas.'],
    section_archive: ['Arquivo', 'Salve backups JSON antes de mudanças importantes. CSV serve para revisão; JSON para restaurar.'],
    cashDrawdown: ['Necessidade máxima de caixa', 'Caixa necessário antes das vendas entrarem. Se passar dos fundos disponíveis, o plano falha antes do lançamento.'],
    landedCost: ['Custo real unitário', 'Custo de um cachecol acabado e embalado antes dos custos gerais. Não é só o orçamento da fábrica.'],
    netRevenue: ['Receita líquida', 'Dinheiro do cliente após tratamento fiscal, devoluções e taxas. Não é lucro final.'],
    cashResult: ['Resultado de caixa', 'Receita líquida menos custos de lançamento modelados, antes do pagamento total do empréstimo e dos impostos.'],
    afterLoan: ['Após pagamento total', 'Visão severa: resultado do lote após pagar principal e juros. Útil, mas propositalmente prudente.'],
    breakEvenSellThrough: ['Sell-through de equilíbrio', 'Vendas iniciais necessárias para cobrir custos, ajustadas por devoluções. Acima de 100% não se sustenta.'],
    scenarioName: ['Nome do cenário', 'Dê um nome claro ao modelo para os backups fazerem sentido depois.'],
    scenarioStatus: ['Status do cenário', 'Use Rascunho para premissas, Orçamento para números de fornecedor e Final só após aprovação.'],
    fiscalMode: ['Regime fiscal', 'Forfettario normalmente significa venda sem IVA e IVA de compras não recuperável. Confirme com o contador.'],
    retailPrice: ['Preço de venda', 'Preço do cliente por cachecol. Não mude casualmente: afeta posicionamento e equilíbrio.'],
    batchSize: ['Tamanho do lote', 'Quantidade de cachecóis produzidos. Mudar isto altera produção e embalagem automaticamente.'],
    sellThrough: ['Sell-through', 'Percentual esperado de vendas iniciais. Use uma estimativa conservadora e teste vários cenários.'],
    salesVatRate: ['IVA vendas', 'Relevante apenas fora do modelo sem IVA. No Forfettario fica travado em zero.'],
    salesVatMode: ['IVA no preço', 'Define se o IVA está incluído, excluído ou fora do modelo. Configuração errada distorce receita.'],
    paymentFee: ['Taxa de pagamento', 'Percentual retido por Stripe, Shopify, PayPal ou equivalente.'],
    fixedFee: ['Taxa fixa por venda', 'Pequena taxa fixa por pedido. Em lotes pequenos pesa mais.'],
    shippingCharged: ['Frete cobrado', 'Quanto o cliente paga pelo frete. Se for zero, a Moscatelli absorve o custo em outro lugar.'],
    productionUnitCost: ['Produção por cachecol', 'Custo do fornecedor por cachecol antes de prêmios e extras. Substitua só por orçamento real.'],
    smallBatchPremium: ['Premium lote pequeno', 'Percentual extra para tiragens pequenas. Mantenha realista até o fornecedor remover.'],
    setupFee: ['Setup da fábrica', 'Custo único de preparação. Em lote pequeno pesa muito por unidade.'],
    dyeingSurcharge: ['Sobretaxa de tingimento', 'Custo de cor ou desenvolvimento de tingimento. Terra Bruna e Bianco Avorio podem pesar separadamente.'],
    colourCount: ['Número de cores', 'Quantidade de cores no lote. Mais cores podem aumentar setup e tingimento.'],
    fringeCost: ['Acabamento da franja', 'Custo extra para executar uma franja controlada. Não esconda em produção vaga.'],
    labelCost: ['Etiqueta e cuidados', 'Custo de etiqueta, care label e identificação do produto.'],
    inboundShipping: ['Frete de entrada', 'Transporte do fornecedor para a Moscatelli antes do envio ao cliente.'],
    packagingMode: ['Regra das caixas', 'Auto protege a lógica de lote/MOQ. Manual só para teste deliberado de embalagem.'],
    packagingMoq: ['MOQ embalagem', 'Pedido mínimo de caixas. É uma armadilha de caixa se passar muito da quantidade de cachecóis.'],
    boxesOrdered: ['Caixas pedidas', 'Quantidade manual de caixas. Se for menor que o lote, o sistema alerta.'],
    boxCost: ['Custo da caixa', 'Custo por embalagem. Inclua caixa, papel, envelope, selo e insertos se possível.'],
    fulfilmentCost: ['Materiais de envio', 'Materiais usados para enviar o pedido, separados da caixa de luxo.'],
    outboundShipping: ['Frete ao cliente', 'Custo para enviar cada pedido se a Moscatelli paga ou subsidia o frete.'],
    returnRate: ['Taxa de devolução', 'Pedidos esperados como reembolsados. Devoluções reduzem vendas mantidas e elevam o equilíbrio.'],
    returnPenalty: ['Custo devolução/reembalagem', 'Custo para verificar, reembalar ou depreciar um cachecol devolvido.'],
    defectRate: ['Taxa de defeitos', 'Unidades esperadas como rejeitadas ou invendáveis. Em lote pequeno pesa muito.'],
    defectPenalty: ['Gestão de defeito', 'Custo extra de lidar com defeitos, além da perda da unidade vendável.'],
    contingencyRate: ['Contingência', 'Reserva para custos desconhecidos. Não zere enquanto os orçamentos não estiverem confirmados.'],
    item: ['Item de custo', 'Nomeie o custo com clareza. Inclua fornecedor ou finalidade quando possível.'],
    category: ['Categoria', 'Agrupa custos fixos para revisão: amostras, fotografia, jurídico, administração.'],
    priority: ['Prioridade', 'Essencial é necessário. Vaidade deve esperar, salvo se apoiar diretamente a prova.'],
    status: ['Status de documentação', 'Mostra se o número é provisório, orçamento, aprovado ou pago.'],
    requiresApproval: ['Etapa de aprovação', 'Use quando a direção ou uma amostra física precisa aprovar antes de gastar.'],
    qty: ['Quantidade', 'Número de unidades desta linha de custo fixo.'],
    unitCost: ['Custo unitário', 'Custo por unidade da linha. O modo IVA decide o bruto.'],
    vatMode: ['IVA do custo', 'Use incluído, excluído ou sem IVA conforme o orçamento. Não chute.'],
    vatRateExpense: ['Alíquota IVA custo', 'Alíquota do custo. No Forfettario, IVA de compras continua sendo saída de caixa.'],
    notes: ['Notas', 'Registre fonte, fornecedor, data, premissa ou risco. Isso vira evidência depois.'],
    loanAmount: ['Valor do empréstimo', 'Capital emprestado. Pode financiar o caixa, mas precisa ser pago.'],
    interestRate: ['Juros / taxa anual', 'Taxa anual usada no cálculo temporal. É modelo, não contrato.'],
    loanTermMonths: ['Prazo do empréstimo', 'Meses usados para proporcionalizar juros. Prazo curto aumenta pressão.'],
    bufferTarget: ['Reserva de caixa', 'Reserva recomendada acima dos custos modelados. Lançamento sério precisa de folga.'],
    rail_netRevenue: ['Receita líquida rápida', 'Apenas referência rápida. Abra Resumo para o cálculo completo.'],
    rail_cashResult: ['Resultado caixa rápido', 'Mostra se o cenário resiste antes de dívida e impostos.'],
    rail_afterLoan: ['Após empréstimo rápido', 'Atalho severo para pressão da dívida. Veja a aba Empréstimo para nuance.'],
    rail_cashDrawdown: ['Caixa necessário rápido', 'O peso imediato de financiamento. Veja antes de aumentar o lote.'],
    rail_breakEven: ['Equilíbrio rápido', 'Se passar de 100%, o cenário é estruturalmente fraco.'],
    rail_risk: ['Indicador de risco', 'Resume o alerta mais forte. Abra Risco para a explicação completa.']
  }
};

const contextualHelpExampleLabels = { en: 'Example', it: 'Esempio', pt: 'Exemplo' };
const contextualHelpExamples = {
  "en": {
    "_default": "Example: if the figure is not confirmed, keep the scenario in Draft, add a note, and save a backup before using it for decisions.",
    "section_overview": "Example: load Current Plan, then check whether break-even is below 100% before touching any cost field.",
    "section_launch": "Example: test 15, 30, and 50 scarves separately instead of forcing one optimistic batch size.",
    "section_unit": "Example: if production rises from €145 to €170, this section immediately shows the higher batch exposure.",
    "section_fixed": "Example: photography stays a fixed cost whether 15 or 50 scarves are produced.",
    "section_loan": "Example: a €15,000 loan may solve cash timing, but it still creates repayment pressure later.",
    "section_risk": "Example: if packaging shortage is red, do not ignore it because the profit line looks acceptable.",
    "section_sensitivity": "Example: compare 50%, 75%, and 100% sell-through before deciding that a batch is safe.",
    "section_comparison": "Example: 75 units may lower unit cost but can still increase cash drawdown beyond available funds.",
    "section_archive": "Example: save a JSON backup before replacing placeholder costs with supplier quotes.",
    "cashDrawdown": "Example: if drawdown is €5,800 and available cash is €4,100, the plan needs capital before launch.",
    "landedCost": "Example: a €145 mill quote can become €210 once box, labels, setup, and inbound shipping are included.",
    "netRevenue": "Example: €350 paid by a customer is reduced by payment fees, returns, and fiscal treatment before becoming usable revenue.",
    "cashResult": "Example: a positive cash result before debt does not mean the brand has tax-free profit available.",
    "afterLoan": "Example: this is intentionally severe: it asks whether the batch can carry the full principal and interest burden.",
    "breakEvenSellThrough": "Example: if this reads 120%, the scenario cannot break even from this batch as currently written.",
    "scenarioName": "Example: use “Current Plan — Prato quote 30 units — May” rather than “test 2”.",
    "scenarioStatus": "Example: Draft is allowed for guesses; Quote-based requires a real supplier number.",
    "fiscalMode": "Example: under Forfettario, sales VAT stays off unless a commercialista gives a different instruction.",
    "retailPrice": "Example: moving from €350 to €390 may improve break-even but changes positioning and buyer expectations.",
    "batchSize": "Example: 15 units tests proof; 75 units tests debt and inventory discipline.",
    "sellThrough": "Example: 60% sell-through means 60 out of 100 saleable scarves initially sell before returns.",
    "salesVatRate": "Example: standard VAT could be 22%, but Forfettario usually keeps this at 0 in the model.",
    "salesVatMode": "Example: VAT included means the displayed retail price already contains VAT.",
    "paymentFee": "Example: if Stripe takes about 3%, a €350 sale loses roughly €10.50 before fixed fees.",
    "fixedFee": "Example: €0.30 per sale looks tiny, but it should still be included for clean records.",
    "shippingCharged": "Example: charging €0 shipping means outbound shipping must be paid by the brand elsewhere.",
    "productionUnitCost": "Example: replace €145 only when the mill quote confirms the same size, fibre, fringe, and batch.",
    "smallBatchPremium": "Example: a 30% premium on tiny runs reflects that mills charge more for small production.",
    "setupFee": "Example: a €350 setup fee over 10 scarves adds €35 per scarf before anything else.",
    "dyeingSurcharge": "Example: two colours at €80 each add €160 before unit production begins.",
    "colourCount": "Example: Terra Bruna plus Bianco Avorio equals 2 colourways for the first plan.",
    "fringeCost": "Example: controlled 3.5 cm fringe may add cost; hiding it inside production weakens accuracy.",
    "labelCost": "Example: woven label plus care tag at €5 per scarf adds €75 to a 15-unit batch.",
    "inboundShipping": "Example: courier from the mill to the packing location is a launch cost even before customers order.",
    "packagingMode": "Example: Auto prevents ordering fewer boxes than scarves unless testing deliberately.",
    "packagingMoq": "Example: a 100-box minimum for 15 scarves ties cash in 85 unused boxes.",
    "boxesOrdered": "Example: if batch is 30 and manual boxes are 20, the workstation flags 10 scarves with no box.",
    "boxCost": "Example: a €35 box across 100 boxes is €3,500 cash out before all boxes are used.",
    "fulfilmentCost": "Example: tissue, protective outer carton, and tape are separate from the luxury box.",
    "outboundShipping": "Example: if the brand pays €18 per parcel, 20 shipped orders cost €360.",
    "returnRate": "Example: 10 sold scarves with a 10% return rate means about 1 returned order.",
    "returnPenalty": "Example: a returned scarf may need inspection, new tissue, and possibly a replacement box.",
    "defectRate": "Example: 5% defects in a 20-unit run means 1 scarf may not be sellable.",
    "defectPenalty": "Example: use this for extra handling, repair, or replacement costs beyond lost inventory.",
    "contingencyRate": "Example: 12% contingency gives room for courier, sampling, or supplier surprises.",
    "item": "Example: write “Photography — product details” instead of just “photos”.",
    "category": "Example: assign commercialista fees to Legal / Admin so fixed costs stay readable.",
    "priority": "Example: product samples are Essential; a cinematic video may be Optional or Vanity.",
    "status": "Example: change Placeholder to Quote received only when the source is documented.",
    "requiresApproval": "Example: mark sample-dependent spending as approval-gated until the physical item is checked.",
    "qty": "Example: 3 courier shipments at €28 each should be quantity 3, unit cost €28.",
    "unitCost": "Example: if a supplier quotes €420 total for 6 items, unit cost is €70.",
    "vatMode": "Example: if the quote says €122 including VAT, choose Included; if it says €100 + VAT, choose Excluded.",
    "vatRateExpense": "Example: use 22 for standard Italian VAT unless the supplier quote states otherwise.",
    "notes": "Example: write supplier name, date, quote number, and whether the quote is written or verbal.",
    "loanAmount": "Example: €15,000 may fund a pilot but must be tested against repayment and sell-through.",
    "interestRate": "Example: 12% APR over 12 months is €1,800 interest on €15,000 before fees.",
    "loanTermMonths": "Example: 6 months creates faster pressure than 24 months even with the same annual rate.",
    "bufferTarget": "Example: a 20% buffer on €5,000 drawdown means keeping €1,000 unspent.",
    "rail_netRevenue": "Example: use this as a pulse check, not as the final profitability answer.",
    "rail_cashResult": "Example: if this is negative, review costs before considering a larger batch.",
    "rail_afterLoan": "Example: if this is deeply negative, debt is not supported by the current batch.",
    "rail_cashDrawdown": "Example: check this before approving supplier deposits or box orders.",
    "rail_breakEven": "Example: a 70% break-even may be possible; 130% is structurally impossible.",
    "rail_risk": "Example: open the Risk tab whenever this badge is not controlled."
  },
  "it": {
    "_default": "Esempio: se il dato non è confermato, lascia lo scenario in Bozza, aggiungi una nota e salva un backup prima di usarlo per decisioni.",
    "section_overview": "Esempio: carica il Piano attuale e verifica che il pareggio resti sotto il 100% prima di modificare i costi.",
    "section_launch": "Esempio: testa 15, 30 e 50 sciarpe separatamente, invece di forzare un lotto ottimistico.",
    "section_unit": "Esempio: se la produzione passa da €145 a €170, questa sezione mostra subito l’esposizione reale del lotto.",
    "section_fixed": "Esempio: la fotografia resta un costo fisso sia con 15 sia con 50 sciarpe.",
    "section_loan": "Esempio: un prestito da €15.000 può risolvere la liquidità iniziale, ma crea comunque obbligo di rimborso.",
    "section_risk": "Esempio: se la carenza di packaging è rossa, non ignorarla solo perché il risultato sembra accettabile.",
    "section_sensitivity": "Esempio: confronta 50%, 75% e 100% di sell-through prima di decidere che un lotto è sicuro.",
    "section_comparison": "Esempio: 75 unità possono abbassare il costo unitario ma aumentare troppo il fabbisogno di cassa.",
    "section_archive": "Esempio: salva un backup JSON prima di sostituire un costo provvisorio con un preventivo.",
    "cashDrawdown": "Esempio: se il fabbisogno è €5.800 e la cassa disponibile è €4.100, serve capitale prima del lancio.",
    "landedCost": "Esempio: un preventivo da €145 può diventare €210 includendo scatola, etichette, setup e spedizione in ingresso.",
    "netRevenue": "Esempio: €350 pagati dal cliente si riducono per commissioni, resi e trattamento fiscale.",
    "cashResult": "Esempio: un risultato positivo prima del debito non significa utile netto disponibile.",
    "afterLoan": "Esempio: è una vista severa: chiede se il lotto sostiene capitale e interessi del prestito.",
    "breakEvenSellThrough": "Esempio: se indica 120%, lo scenario non può andare in pareggio così com’è.",
    "scenarioName": "Esempio: usa “Piano attuale — preventivo Prato 30 unità — maggio”, non “test 2”.",
    "scenarioStatus": "Esempio: Bozza vale per ipotesi; Basato su preventivo richiede un dato reale del fornitore.",
    "fiscalMode": "Esempio: in Forfettario l’IVA vendita resta normalmente disattivata salvo indicazione del commercialista.",
    "retailPrice": "Esempio: passare da €350 a €390 può aiutare il pareggio, ma cambia posizionamento e aspettative.",
    "batchSize": "Esempio: 15 unità testano la prova; 75 unità testano debito e disciplina inventario.",
    "sellThrough": "Esempio: 60% di sell-through significa che 60 sciarpe vendibili su 100 vengono vendute inizialmente, prima dei resi.",
    "salesVatRate": "Esempio: l’IVA ordinaria può essere 22%, ma in Forfettario questo campo resta normalmente a 0.",
    "salesVatMode": "Esempio: IVA inclusa significa che il prezzo retail visualizzato contiene già l’IVA.",
    "paymentFee": "Esempio: con circa 3%, una vendita da €350 perde circa €10,50 prima della commissione fissa.",
    "fixedFee": "Esempio: €0,30 per vendita sembra poco, ma va incluso per avere conti puliti.",
    "shippingCharged": "Esempio: spedizione a €0 significa che il costo di spedizione è assorbito dal brand altrove.",
    "productionUnitCost": "Esempio: sostituisci €145 solo se il preventivo conferma stessa misura, fibra, frangia e lotto.",
    "smallBatchPremium": "Esempio: un 30% sui piccoli lotti riflette il costo maggiore imposto da molti produttori.",
    "setupFee": "Esempio: €350 di setup su 10 sciarpe aggiungono €35 per sciarpa prima di tutto il resto.",
    "dyeingSurcharge": "Esempio: due colori a €80 ciascuno aggiungono €160 prima della produzione unitaria.",
    "colourCount": "Esempio: Terra Bruna + Bianco Avorio = 2 varianti colore nel primo piano.",
    "fringeCost": "Esempio: una frangia controllata da 3,5 cm può avere costo proprio; non nasconderlo nella produzione generica.",
    "labelCost": "Esempio: etichetta e care label a €5 per sciarpa aggiungono €75 su 15 unità.",
    "inboundShipping": "Esempio: il corriere dal produttore al luogo di confezionamento è un costo prima degli ordini cliente.",
    "packagingMode": "Esempio: Auto evita di ordinare meno scatole delle sciarpe, salvo test deliberato.",
    "packagingMoq": "Esempio: MOQ 100 scatole per 15 sciarpe immobilizza cassa in 85 scatole non usate.",
    "boxesOrdered": "Esempio: se il lotto è 30 e le scatole manuali sono 20, il sistema segnala 10 sciarpe senza scatola.",
    "boxCost": "Esempio: una scatola da €35 su 100 pezzi richiede €3.500 di cassa prima di usarle tutte.",
    "fulfilmentCost": "Esempio: velina, scatola esterna e nastro sono separati dalla scatola di lusso.",
    "outboundShipping": "Esempio: se il brand paga €18 per pacco, 20 ordini spediti costano €360.",
    "returnRate": "Esempio: 10 vendite con 10% di resi significano circa 1 ordine rimborsato.",
    "returnPenalty": "Esempio: un reso può richiedere controllo, nuova velina e magari una nuova scatola.",
    "defectRate": "Esempio: 5% di difetti su 20 unità significa 1 sciarpa potenzialmente non vendibile.",
    "defectPenalty": "Esempio: usalo per gestione, riparazione o sostituzione oltre alla perdita di inventario.",
    "contingencyRate": "Esempio: 12% di contingenza copre corrieri, campioni o sorprese del fornitore.",
    "item": "Esempio: scrivi “Fotografia — dettagli prodotto” invece di “foto”.",
    "category": "Esempio: inserisci il commercialista in Legale / Admin per mantenere leggibili i costi fissi.",
    "priority": "Esempio: campioni prodotto sono Essenziali; un video cinematografico può essere Opzionale o Vanità.",
    "status": "Esempio: passa da Provvisorio a Preventivo ricevuto solo quando la fonte è documentata.",
    "requiresApproval": "Esempio: marca la spesa legata al campione come soggetta ad approvazione fino alla verifica fisica.",
    "qty": "Esempio: 3 spedizioni a €28 ciascuna = quantità 3, costo unitario €28.",
    "unitCost": "Esempio: se il fornitore quota €420 per 6 pezzi, il costo unitario è €70.",
    "vatMode": "Esempio: se il preventivo dice €122 IVA inclusa, scegli Inclusa; se dice €100 + IVA, scegli Esclusa.",
    "vatRateExpense": "Esempio: usa 22 per IVA italiana ordinaria salvo indicazione diversa del fornitore.",
    "notes": "Esempio: registra fornitore, data, numero preventivo e se è scritto o verbale.",
    "loanAmount": "Esempio: €15.000 possono finanziare un pilota, ma vanno testati contro rimborso e sell-through.",
    "interestRate": "Esempio: 12% annuo su €15.000 per 12 mesi equivale a €1.800 di interessi prima di altri costi.",
    "loanTermMonths": "Esempio: 6 mesi creano più pressione di 24 mesi anche con lo stesso tasso annuo.",
    "bufferTarget": "Esempio: 20% di riserva su €5.000 di fabbisogno significa tenere €1.000 non spesi.",
    "rail_netRevenue": "Esempio: usalo come controllo rapido, non come risposta finale sulla redditività.",
    "rail_cashResult": "Esempio: se è negativo, rivedi i costi prima di considerare un lotto maggiore.",
    "rail_afterLoan": "Esempio: se è molto negativo, il debito non è sostenuto dal lotto attuale.",
    "rail_cashDrawdown": "Esempio: guardalo prima di approvare acconti al fornitore o ordini di scatole.",
    "rail_breakEven": "Esempio: 70% può essere possibile; 130% è strutturalmente impossibile.",
    "rail_risk": "Esempio: apri la scheda Rischio ogni volta che il badge non è sotto controllo."
  },
  "pt": {
    "_default": "Exemplo: se o número não estiver confirmado, mantenha o cenário como Rascunho, adicione uma nota e salve um backup antes de usar em decisões.",
    "section_overview": "Exemplo: carregue o Plano atual e veja se o equilíbrio fica abaixo de 100% antes de alterar qualquer custo.",
    "section_launch": "Exemplo: teste 15, 30 e 50 cachecóis separadamente, em vez de forçar um lote otimista.",
    "section_unit": "Exemplo: se a produção sobe de €145 para €170, esta seção mostra imediatamente a nova exposição do lote.",
    "section_fixed": "Exemplo: fotografia continua sendo custo fixo com 15 ou 50 cachecóis.",
    "section_loan": "Exemplo: um empréstimo de €15.000 pode resolver caixa inicial, mas ainda cria obrigação de pagamento.",
    "section_risk": "Exemplo: se falta de embalagem aparece em vermelho, não ignore só porque o resultado parece aceitável.",
    "section_sensitivity": "Exemplo: compare 50%, 75% e 100% de sell-through antes de decidir que um lote é seguro.",
    "section_comparison": "Exemplo: 75 unidades podem reduzir custo unitário, mas aumentar demais a necessidade de caixa.",
    "section_archive": "Exemplo: salve um backup JSON antes de trocar custos provisórios por orçamentos reais.",
    "cashDrawdown": "Exemplo: se a necessidade é €5.800 e o caixa disponível é €4.100, falta capital antes do lançamento.",
    "landedCost": "Exemplo: um orçamento de €145 pode virar €210 com caixa, etiquetas, setup e frete de entrada.",
    "netRevenue": "Exemplo: €350 pagos pelo cliente caem depois de taxas, devoluções e tratamento fiscal.",
    "cashResult": "Exemplo: caixa positivo antes da dívida não significa lucro líquido disponível.",
    "afterLoan": "Exemplo: é uma visão severa: pergunta se o lote sustenta principal e juros do empréstimo.",
    "breakEvenSellThrough": "Exemplo: se marcar 120%, o cenário não chega ao equilíbrio como está.",
    "scenarioName": "Exemplo: use “Plano atual — orçamento Prato 30 unidades — maio”, não “teste 2”.",
    "scenarioStatus": "Exemplo: Rascunho serve para premissas; Baseado em orçamento exige número real de fornecedor.",
    "fiscalMode": "Exemplo: no Forfettario, IVA sobre venda normalmente fica desligado salvo orientação do contador.",
    "retailPrice": "Exemplo: subir de €350 para €390 pode ajudar o equilíbrio, mas muda posicionamento e expectativa do cliente.",
    "batchSize": "Exemplo: 15 unidades testam prova; 75 unidades testam dívida e disciplina de estoque.",
    "sellThrough": "Exemplo: 60% de sell-through significa que 60 de 100 cachecóis vendáveis vendem inicialmente, antes das devoluções.",
    "salesVatRate": "Exemplo: IVA padrão pode ser 22%, mas no Forfettario este campo normalmente fica em 0.",
    "salesVatMode": "Exemplo: IVA incluído significa que o preço de venda já contém o IVA.",
    "paymentFee": "Exemplo: com cerca de 3%, uma venda de €350 perde cerca de €10,50 antes da taxa fixa.",
    "fixedFee": "Exemplo: €0,30 por venda parece pouco, mas entra para manter o registro limpo.",
    "shippingCharged": "Exemplo: frete cobrado a €0 significa que o custo de envio é absorvido pelo brand em outro lugar.",
    "productionUnitCost": "Exemplo: substitua €145 só quando o orçamento confirmar mesma medida, fibra, franja e lote.",
    "smallBatchPremium": "Exemplo: 30% em lotes pequenos reflete o custo extra cobrado por muitos fornecedores.",
    "setupFee": "Exemplo: €350 de setup em 10 cachecóis adiciona €35 por cachecol antes de qualquer outro custo.",
    "dyeingSurcharge": "Exemplo: duas cores a €80 cada adicionam €160 antes da produção unitária.",
    "colourCount": "Exemplo: Terra Bruna + Bianco Avorio = 2 cores no primeiro plano.",
    "fringeCost": "Exemplo: franja controlada de 3,5 cm pode ter custo próprio; não esconda isso em produção genérica.",
    "labelCost": "Exemplo: etiqueta e care label a €5 por cachecol adicionam €75 em um lote de 15.",
    "inboundShipping": "Exemplo: transporte do fornecedor até o local de embalagem é custo antes dos pedidos dos clientes.",
    "packagingMode": "Exemplo: Auto evita pedir menos caixas do que cachecóis, salvo teste deliberado.",
    "packagingMoq": "Exemplo: MOQ de 100 caixas para 15 cachecóis prende caixa em 85 embalagens não usadas.",
    "boxesOrdered": "Exemplo: se o lote é 30 e as caixas manuais são 20, o sistema alerta 10 cachecóis sem caixa.",
    "boxCost": "Exemplo: caixa de €35 em 100 unidades exige €3.500 de caixa antes de usar todas.",
    "fulfilmentCost": "Exemplo: papel de proteção, caixa externa e fita são separados da caixa de luxo.",
    "outboundShipping": "Exemplo: se o brand paga €18 por pacote, 20 pedidos enviados custam €360.",
    "returnRate": "Exemplo: 10 vendas com 10% de devolução significam cerca de 1 pedido reembolsado.",
    "returnPenalty": "Exemplo: uma devolução pode exigir inspeção, novo papel e talvez nova caixa.",
    "defectRate": "Exemplo: 5% de defeitos em 20 unidades significa 1 cachecol possivelmente invendável.",
    "defectPenalty": "Exemplo: use para manuseio, reparo ou substituição além da perda de estoque.",
    "contingencyRate": "Exemplo: 12% de contingência cobre frete, amostras ou surpresas do fornecedor.",
    "item": "Exemplo: escreva “Fotografia — detalhes do produto” em vez de apenas “fotos”.",
    "category": "Exemplo: coloque contador/commercialista em Jurídico / Admin para manter custos fixos legíveis.",
    "priority": "Exemplo: amostras são essenciais; vídeo cinematográfico pode ser Opcional ou Vaidade.",
    "status": "Exemplo: mude de Provisório para Orçamento recebido só quando a fonte estiver documentada.",
    "requiresApproval": "Exemplo: marque gasto dependente de amostra como sujeito a aprovação até a verificação física.",
    "qty": "Exemplo: 3 envios a €28 cada = quantidade 3, custo unitário €28.",
    "unitCost": "Exemplo: se o fornecedor cobra €420 por 6 itens, o custo unitário é €70.",
    "vatMode": "Exemplo: se o orçamento diz €122 IVA incluído, escolha Incluído; se diz €100 + IVA, escolha Excluído.",
    "vatRateExpense": "Exemplo: use 22 para IVA italiano padrão salvo indicação diferente do fornecedor.",
    "notes": "Exemplo: registre fornecedor, data, número do orçamento e se é escrito ou verbal.",
    "loanAmount": "Exemplo: €15.000 podem financiar um piloto, mas precisam ser testados contra pagamento e sell-through.",
    "interestRate": "Exemplo: 12% ao ano em €15.000 por 12 meses equivale a €1.800 de juros antes de outros custos.",
    "loanTermMonths": "Exemplo: 6 meses criam mais pressão que 24 meses mesmo com a mesma taxa anual.",
    "bufferTarget": "Exemplo: 20% de reserva sobre €5.000 de necessidade significa manter €1.000 sem gastar.",
    "rail_netRevenue": "Exemplo: use como checagem rápida, não como resposta final de rentabilidade.",
    "rail_cashResult": "Exemplo: se estiver negativo, revise custos antes de considerar lote maior.",
    "rail_afterLoan": "Exemplo: se estiver muito negativo, a dívida não é sustentada pelo lote atual.",
    "rail_cashDrawdown": "Exemplo: veja antes de aprovar depósitos ao fornecedor ou pedidos de caixas.",
    "rail_breakEven": "Exemplo: 70% pode ser possível; 130% é estruturalmente impossível.",
    "rail_risk": "Exemplo: abra Risco sempre que o selo não estiver controlado."
  }
};

const panelHelpByI18n = {
  k_revenueInventory: 'section_overview',
  k_loanModel: 'section_loan',
  k_launchAssumptions: 'section_launch',
  k_variable: 'section_unit',
  k_fixedRegister: 'section_fixed',
  k_riskDashboard: 'section_risk',
  k_sensitivity: 'section_sensitivity',
  k_batchComparison: 'section_comparison',
  k_backupTitle: 'section_archive'
};

const railHelpByI18n = {
  k_netRevenue: 'rail_netRevenue',
  k_cashResult: 'rail_cashResult',
  k_afterLoan: 'rail_afterLoan',
  k_cashDrawdown: 'rail_cashDrawdown',
  k_breakEvenSell: 'rail_breakEven'
};

let helpTimer = null;
let helpHideTimer = null;
let activeHelpButton = null;

function getHelpContent(key) {
  const langCatalogue = contextualHelp[state.uiLang] || contextualHelp.en;
  const base = langCatalogue[key] || contextualHelp.en[key] || null;
  if (!base) return null;
  const exampleCatalogue = contextualHelpExamples[state.uiLang] || contextualHelpExamples.en;
  const example = exampleCatalogue[key] || exampleCatalogue._default || contextualHelpExamples.en[key] || contextualHelpExamples.en._default || '';
  return [base[0], base[1], example];
}

function ensureHelpPopover() {
  let popover = document.getElementById('contextualHelpPopover');
  if (!popover) {
    popover = document.createElement('aside');
    popover.id = 'contextualHelpPopover';
    popover.className = 'contextual-help-popover';
    popover.setAttribute('role', 'tooltip');
    popover.setAttribute('aria-hidden', 'true');
    document.body.appendChild(popover);
    popover.addEventListener('mouseenter', () => clearTimeout(helpHideTimer));
    popover.addEventListener('mouseleave', hideContextualHelp);
  }
  return popover;
}

function positionHelpPopover(button, popover) {
  const rect = button.getBoundingClientRect();
  const width = Math.min(360, window.innerWidth - 28);
  const gap = 12;
  let left = rect.right + gap;
  if (left + width > window.innerWidth - 14) left = rect.left - width - gap;
  if (left < 14) left = 14;
  const measuredHeight = popover.offsetHeight || 120;
  let top = rect.top + rect.height / 2 - measuredHeight / 2;
  top = Math.max(14, Math.min(top, window.innerHeight - measuredHeight - 14));
  popover.style.width = `${width}px`;
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

function showContextualHelp(button) {
  const key = button.dataset.helpKey;
  const content = getHelpContent(key);
  if (!content) return;
  const popover = ensureHelpPopover();
  const exampleLabel = contextualHelpExampleLabels[state.uiLang] || contextualHelpExampleLabels.en;
  popover.innerHTML = `<strong>${escapeHtml(content[0])}</strong><p>${escapeHtml(content[1])}</p>${content[2] ? `<div class="help-example"><span>${escapeHtml(exampleLabel)}</span><p>${escapeHtml(content[2])}</p></div>` : ''}`;
  popover.classList.add('is-visible');
  popover.setAttribute('aria-hidden', 'false');
  activeHelpButton = button;
  button.setAttribute('aria-expanded', 'true');
  positionHelpPopover(button, popover);
}

function scheduleContextualHelp(button, delay = 1000) {
  clearTimeout(helpTimer);
  clearTimeout(helpHideTimer);
  helpTimer = setTimeout(() => showContextualHelp(button), delay);
}

function hideContextualHelp() {
  clearTimeout(helpTimer);
  clearTimeout(helpHideTimer);
  helpHideTimer = setTimeout(() => {
    const popover = document.getElementById('contextualHelpPopover');
    if (popover) {
      popover.classList.remove('is-visible');
      popover.setAttribute('aria-hidden', 'true');
    }
    if (activeHelpButton) activeHelpButton.setAttribute('aria-expanded', 'false');
    activeHelpButton = null;
  }, 120);
}

function addHelpButton(anchor, key, variant = '') {
  if (!anchor || !getHelpContent(key)) return;
  const parent = anchor.parentElement;
  if (!parent) return;
  const existing = Array.from(parent.children).find(child => child.classList && child.classList.contains('help-dot') && child.dataset.helpKey === key);
  const label = state.uiLang === 'it' ? 'Aiuto contestuale' : state.uiLang === 'pt' ? 'Ajuda contextual' : 'Contextual help';
  if (existing) {
    existing.setAttribute('aria-label', label);
    return;
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `help-dot ${variant ? `help-dot--${variant}` : ''}`;
  button.dataset.helpKey = key;
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', 'false');
  button.textContent = '?';
  button.addEventListener('mouseenter', () => scheduleContextualHelp(button, 1000));
  button.addEventListener('mouseleave', hideContextualHelp);
  button.addEventListener('focus', () => scheduleContextualHelp(button, 300));
  button.addEventListener('blur', hideContextualHelp);
  button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const popover = ensureHelpPopover();
    if (activeHelpButton === button && popover.classList.contains('is-visible')) hideContextualHelp();
    else showContextualHelp(button);
  });
  anchor.insertAdjacentElement('afterend', button);
}

function injectContextualHelp() {
  document.querySelectorAll('#section-calculator label[for]').forEach(label => {
    addHelpButton(label, label.getAttribute('for'), 'field');
  });

  document.querySelectorAll('#section-calculator .card').forEach(card => {
    const value = card.querySelector('.value[id]');
    const label = card.querySelector('.label');
    if (value && label) addHelpButton(label, value.id, 'card');
  });

  document.querySelectorAll('#section-calculator .panel-head h2[data-i18n]').forEach(heading => {
    const key = panelHelpByI18n[heading.dataset.i18n];
    if (key) addHelpButton(heading, key, 'heading');
  });

  document.querySelectorAll('#section-calculator .rail-row span[data-i18n]').forEach(span => {
    const key = railHelpByI18n[span.dataset.i18n];
    if (key) addHelpButton(span, key, 'rail');
  });

  const railRisk = document.getElementById('railRiskBadge');
  if (railRisk) addHelpButton(railRisk, 'rail_risk', 'rail');
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function attachEvents() {
  document.querySelectorAll('.subtab').forEach(btn => btn.addEventListener('click', () => openCalcTab(btn.dataset.calctab)));
  document.querySelectorAll('[data-preset]').forEach(btn => { btn.onclick = () => preset(btn.dataset.preset); });
  if (els.alertsToggle) {
    els.alertsToggle.addEventListener('click', () => {
      const open = !els.alertsMenu.classList.contains('is-open');
      els.alertsMenu.classList.toggle('is-open', open);
      els.alertsMenu.setAttribute('aria-hidden', String(!open));
      els.alertsToggle.setAttribute('aria-expanded', String(open));
    });
  }
  document.addEventListener('click', event => {
    if (!els.alertsMenu || !els.alertsToggle) return;
    if (!event.target.closest('.notification-centre')) {
      els.alertsMenu.classList.remove('is-open');
      els.alertsMenu.setAttribute('aria-hidden', 'true');
      els.alertsToggle.setAttribute('aria-expanded', 'false');
    }
  });
  if (els.languageSelect) els.languageSelect.addEventListener('change', () => { state.uiLang = els.languageSelect.value; render(); renderAcademy(); });
  els.addBtn.onclick = addExpense;
  [els.item, els.qty, els.unitCost, els.notes].forEach(input => input.addEventListener('keydown', event => { if (event.key === 'Enter') addExpense(); }));
  els.resetBtn.onclick = () => {
    if (!confirm(t('confirm_reset'))) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    state.uiLang = 'en';
    state.expenses = defaultExpenses();
    Object.assign(state.scenario, { scenarioName: 'Blank scenario', scenarioStatus: 'Draft', fiscalMode: 'forfettario', retailPrice: 0, batchSize: 0, sellThrough: 0, salesVatRate: 0, salesVatMode: 'none', paymentFee: 0, fixedFee: 0, shippingCharged: 0 });
    Object.assign(state.variable, { productionUnitCost: 0, smallBatchPremium: 0, setupFee: 0, dyeingSurcharge: 0, colourCount: 1, fringeCost: 0, labelCost: 0, inboundShipping: 0, packagingMode: 'auto', packagingMoq: 0, boxesOrdered: 0, boxCost: 0, fulfilmentCost: 0, outboundShipping: 0, returnRate: 0, returnPenalty: 0, defectRate: 0, defectPenalty: 0, contingencyRate: 0 });
    Object.assign(state.loan, { loanAmount: 0, interestRate: 0, loanTermMonths: 12, bufferTarget: 0 });
    render();
  };
  els.exportBtn.onclick = exportCsv;
  els.printBtn.onclick = () => window.print();
  els.saveBackupBtn.onclick = exportBackup;
  els.loadBackupBtn.onclick = () => els.backupFileInput.click();
  els.backupFileInput.onchange = event => openImportConfirm(event.target.files[0]);
  els.cancelImportBtn.onclick = closeImportConfirm;
  els.confirmImportBtn.onclick = () => loadBackupFile(pendingImportFile);
  els.assistantFab.onclick = () => toggleAssistant(!els.assistantPanel.classList.contains('is-open'));
  els.openAssistantPanel.onclick = () => toggleAssistant(true);
  els.closeAssistantPanel.onclick = () => toggleAssistant(false);
  els.copyScenarioBtn.onclick = copyScenarioSummary;
  els.assistantExportJsonBtn.onclick = exportBackup;
  if (els.askAiBtn) els.askAiBtn.onclick = askFinancialAssistant;
  if (els.aiEndpointUrl) {
    try { els.aiEndpointUrl.value = localStorage.getItem('mfw_netlify_function_url') || ''; } catch {}
  }

  scenarioIds.forEach(id => $(id).addEventListener($(id).tagName === 'SELECT' ? 'change' : 'input', () => {
    state.scenario[id] = $(id).type === 'number' ? num($(id).value) : $(id).value;
    if (id === 'fiscalMode' && state.scenario.fiscalMode === 'forfettario') {
      state.scenario.salesVatMode = 'none';
      state.scenario.salesVatRate = 0;
    }
    render();
  }));
  variableIds.forEach(id => $(id).addEventListener($(id).tagName === 'SELECT' ? 'change' : 'input', () => { state.variable[id] = $(id).type === 'number' ? num($(id).value) : $(id).value; render(); }));
  loanIds.forEach(id => $(id).addEventListener('input', () => { state.loan[id] = num($(id).value); render(); }));
  window.addEventListener('hashchange', route);
}

load();
attachEvents();
renderAcademy();
render();
route();
