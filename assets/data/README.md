# Tax Rate Data Sources

All tax rate data is sourced from the Canada Revenue Agency (CRA) official publications.

## Data Source URL

[CRA - Canadian Income Tax Rates for Individuals - Current and Previous Years](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html)

## Data Extraction

Federal and provincial bracket data is extracted from the CRA content fragments API. The CRA interactive widget loads data from this endpoint, which contains structured bracket and rate data for all years and provinces.

Provincial basic personal amounts, dividend tax credits, Ontario surtax/health premium, and Quebec abatement are sourced from the CRA general income tax and benefit package pages for each year, provincial budget documents, and archived CRA forms.

## Completion Status by Year

| Year | Federal | ON | BC | AB | QC | MB | SK | NS | NB | NL | PE | NT | NU | YT | Notes |
|------|---------|----|----|----|----|----|----|----|----|----|----|----|----|----|-------|
| 2015 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 4 federal brackets (pre-2016 structure) |
| 2016 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New 33% top bracket introduced; NB rates restructured |
| 2017 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| 2018 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| 2019 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| 2020 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Federal BPA increased to $13,229 |
| 2021 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Federal BPA increased to $13,808 |
| 2022 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Federal BPA increased to $14,398 |
| 2023 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Federal BPA increased to $15,000 |
| 2024 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PE expanded to 5 brackets; AB expanded to 6 brackets |
| 2025 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Federal rate reduced to 14% mid-year (effective 14.5%) |
| 2026 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Federal rate permanently 14% |

## Schema Notes

### Federal brackets
- 2015: 4 brackets (15%, 22%, 26%, 29%) — pre-2016 structure
- 2016+: 5 brackets (15/14%, 20.5%, 26%, 29%, 33%)
- 2025: First bracket rate is 14.5% effective for the full year (14% from July 1)
- 2026: First bracket rate permanently 14%

### Provincial brackets
- **ON**: Ontario surtax and health premium fields present. Health premium tiers match CRA published values.
- **QC**: Quebec abatement rate (16.5%) applied. Quebec brackets are from Revenu Quebec.
- **AB**: 2015-2023 used single 10% rate. 2024+ introduced progressive brackets (6 tiers in 2025).
- **PE**: Expanded from 3 to 5 brackets in 2024.
- **NL**: Expanded from 5 to 8 brackets in 2022.
- **BC**: Added 7th bracket (20.5%) in 2025.

### Fields That May Be Null
Where CRA data is not available or not applicable:
- `bpa` (basic personal amount): null if not available for that year/province
- `surtaxT1`, `surtaxR1`, etc.: null for non-Ontario provinces
- `healthPremium`: null for non-Ontario provinces
- `abatement`: null for non-Quebec provinces
- `notes`: null when no special cases apply

### Dividend Tax Credits
- `edivTC`: Eligible dividend tax credit rate (provincial)
- `nedivTC`: Non-eligible dividend tax credit rate (provincial)
- Federal DTC rates: `eligibleDividendCredit` = 0.150198 (6/11 of gross-up), `nonEligibleDividendCredit` = 0.090301 (9/13 of gross-up)
- Federal gross-up rates: `eligibleDividendGrossUp` = 0.38, `nonEligibleDividendGrossUp` = 0.15

### Capital Gains
- `capitalGainsInclusion`: 0.50 (50%) for all years 2015-2026

## File Locations

- Year data: `assets/data/rates-YYYY.json`
- Generated pages: `tax-rates-YYYY.html`
- Comparison data (for estimator): `assets/js/compare-data.js`

## Updating Rates

Use the editor's Import JSON feature to batch-update rates from CRA data, or manually edit individual year files through the Year Pages editor.
