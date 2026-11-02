// Topic profiles: which "facets" a decision-maker should be able to answer.
export const BASE_FACETS = [
  { name: 'Deadline', re: /deadline|last date|closes?|apply (by|before)|due date/i, priority: 'Critical' },
  { name: 'Application process / official link', re: /apply (online|at|via|through)|application (form|portal|process|link)|portal/i, priority: 'Critical' },
  { name: 'Contact / support', re: /contact|helpline|e-?mail|phone|@/i, priority: 'Low' },
];
export const TOPICS = {
  scholarship: { label: 'Scholarship / Admission', facets: [
    { name: 'Eligibility', re: /eligib|qualif|who can|open to|must (be|have|score)/i, priority: 'High' },
    { name: 'Required documents', re: /document|certificate|transcript|proof|marksheet|passport|passbook|aadhaar|letter/i, priority: 'Critical' },
    { name: 'Renewal / continuation', re: /renew|continu|subsequent year|next year|maintain|retain/i, priority: 'High' },
    { name: 'Amount / benefits', re: /amount|stipend|award|benefit|covers?|₹|rs\.?\s?\d|\$\d|inr/i, priority: 'Medium' },
    { name: 'Selection process', re: /selection|shortlist|interview|merit|evaluat/i, priority: 'Medium' } ] },
  job: { label: 'Job / Career', facets: [
    { name: 'Eligibility / qualifications', re: /eligib|qualif|experience|degree|skills?|age limit/i, priority: 'High' },
    { name: 'Required documents', re: /document|certificate|resume|cv|transcript|id proof/i, priority: 'Critical' },
    { name: 'Salary / benefits', re: /salary|ctc|stipend|pay|benefit|₹|\$\d/i, priority: 'High' },
    { name: 'Selection process', re: /selection|interview|test|round|shortlist/i, priority: 'Medium' },
    { name: 'Probation / contract terms', re: /probation|contract|notice period|bond|tenure/i, priority: 'Medium' } ] },
  service: { label: 'Public service / Scheme', facets: [
    { name: 'Eligibility', re: /eligib|qualif|who can|beneficiar/i, priority: 'High' },
    { name: 'Required documents', re: /document|certificate|proof|aadhaar|id/i, priority: 'Critical' },
    { name: 'Fees / charges', re: /fee|charge|cost|free|₹|\$\d/i, priority: 'High' },
    { name: 'Processing time', re: /processing time|days|weeks|within/i, priority: 'Medium' },
    { name: 'Renewal / validity', re: /renew|validity|valid for|expire/i, priority: 'Medium' } ] },
};
export const DOCS = ['income certificate','caste certificate','marksheet','mark sheet','transcript','passport photo','passport','bank passbook','passbook','aadhaar','domicile','recommendation letter','admission letter','id proof','birth certificate','resume','cv','statement of purpose','photograph'];
