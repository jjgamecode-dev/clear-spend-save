# MoneyFlow first-pass redesign

## What I’ll build
- Replace the blank screen with a cohesive MoneyFlow application using the attached reference as the visual and interaction baseline.
- Add six working pages: Dashboard, Budget, Expenses, Savings, Reports, and Settings, with shared desktop sidebar and purpose-built mobile navigation.
- Preserve manual finance workflows: add/edit/delete expenses, edit budgets and income, manage savings goals and contributions, filter transactions, change report periods, and update settings.

## Experience
- Make the Dashboard immediately answer the month’s financial position, emphasizing Available and showing one concise Spent / Saved / Available allocation.
- Keep Budget focused on planned, actual, and remaining amounts with compact category progress.
- Keep Expenses focused on total spending, fast expense entry, and a scannable date-grouped transaction list.
- Keep Savings focused on goal progress and prominent contributions; goal balances will be derived from contribution records.
- Reserve deeper trend, comparison, and category charts for Reports.
- Use spacious layouts, restrained cards, clear actions, touch-friendly controls, and dedicated mobile compositions rather than shrinking desktop screens.

## Structure and data
- Create separate shareable pages for all six destinations with unique page metadata.
- Keep calculations in standalone utilities and financial data behind a replaceable in-memory store interface, ready for the later persistence layer.
- Use typed, data-driven components; totals and progress values will always be calculated from records.
- Add no authentication, external finance integrations, AI advice, investments, or cryptocurrency features.

## Validation
- Verify desktop and mobile layouts across all six pages.
- Exercise navigation, month changes, expense entry/editing, budget edits, savings contributions, report period controls, and settings interactions.
- Check chart readability, overflow, empty states, dialogs, and console errors.
