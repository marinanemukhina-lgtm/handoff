// Shared by the standalone browser page and the Node CLI.
function renderHandoff(pkg, mode = pkg.mode ?? 'continue') {
  const decisions = pkg.decisions
    .filter(decision => decision.status === 'approved')
    .map(decision => `- ${decision.id}: ${decision.statement} (source: ${decision.source})`);
  const commitments = pkg.commitments.map(commitment => {
    const statement = commitment.statement || '[Statement not recorded in this package]';
    const due = commitment.due ? ` | due: ${commitment.due}` : '';
    return `- ${commitment.id}: ${statement} | owner: ${commitment.owner} | status: ${commitment.status}${due}`;
  });
  const labels = { continue: 'CONTINUE', review: 'REVIEW', 'open-field': 'OPEN_FIELD' };
  const sections = [
    '# HANDOFF — ' + pkg.project,
    'Snapshot: ' + pkg.snapshot,
    '## Intent\n' + pkg.intent,
    '## Verified state / stated state\n' + pkg.state,
    '## Approved decisions\n' + (decisions.join('\n') || 'None recorded'),
    '## Commitments\n' + (commitments.join('\n') || 'None recorded'),
    '## Permissions\nAllowed: ' + pkg.permissions.allowed.join(', ') +
      '\nApproval required: ' + pkg.permissions.requires_approval.join(', '),
    '## Next action\n' + pkg.next.action + '\nAcceptance: ' + pkg.next.acceptance,
    '## Receiver checklist\n- [ ] Verify sources and snapshot freshness\n- [ ] Restate intent, approved decisions and obligations\n- [ ] Confirm authority before consequential actions\n- [ ] Return evidence and unresolved items',
    '## Mode\nSelected: ' + labels[mode] +
      '\nCONTINUE by default. REVIEW and OPEN_FIELD are opt-in analysis only. No mode grants execution authority.'
  ];
  if (mode === 'review') {
    sections.push('## Optional review — no execution\nConsider future transition costs, deadlines, penalties, dependencies and expected benefits. Historical sunk costs alone do not justify continuing. Request approval before changing the plan.');
  }
  if (mode === 'open-field') {
    sections.push('## Optional open field — no execution\nExplore alternative frames, contradictions and conditions for reconsideration. Preserve approved decisions and commitments. Request approval before changing the plan.');
  }
  return sections.join('\n\n') + '\n';
}

if (typeof module !== 'undefined' && module.exports) module.exports = renderHandoff;
