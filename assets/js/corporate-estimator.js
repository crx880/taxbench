/* ============================================================
   TaxBench – Corporate Income Tax Estimator
   CCPC Part I, Part IV, RDTOH, dividend refund, CDA.
   Federal + all 13 provinces/territories.
   ============================================================ */

(function () {
  "use strict";

  /* ---- Embedded 2026 Data ---- */
  var CORP = {
    year: 2026,
    federal: {
      generalRate: 0.15,
      smallBusinessRate: 0.09,
      smallBusinessLimit: 500000,
      aggregateInvestmentRate: 0.3867,
      nerdtohRate: 0.3067,
      partIVEligibleRate: 0.3833,
      partIVNonEligibleRate: 0.0,
      capitalGainsInclusion: 0.5
    },
    provinces: {
      AB: { name: "Alberta", generalRate: 0.08, smallBusinessRate: 0.02, smallBusinessLimit: 500000 },
      BC: { name: "British Columbia", generalRate: 0.12, smallBusinessRate: 0.02, smallBusinessLimit: 500000 },
      MB: { name: "Manitoba", generalRate: 0.12, smallBusinessRate: 0.00, smallBusinessLimit: 500000 },
      NB: { name: "New Brunswick", generalRate: 0.14, smallBusinessRate: 0.025, smallBusinessLimit: 500000 },
      NL: { name: "Newfoundland and Labrador", generalRate: 0.15, smallBusinessRate: 0.03, smallBusinessLimit: 500000 },
      NS: { name: "Nova Scotia", generalRate: 0.14, smallBusinessRate: 0.025, smallBusinessLimit: 500000 },
      ON: { name: "Ontario", generalRate: 0.115, smallBusinessRate: 0.032, smallBusinessLimit: 500000 },
      PE: { name: "Prince Edward Island", generalRate: 0.16, smallBusinessRate: 0.01, smallBusinessLimit: 500000 },
      QC: { name: "Quebec", generalRate: 0.115, smallBusinessRate: 0.032, smallBusinessLimit: 500000 },
      SK: { name: "Saskatchewan", generalRate: 0.12, smallBusinessRate: 0.01, smallBusinessLimit: 600000 },
      NT: { name: "Northwest Territories", generalRate: 0.115, smallBusinessRate: 0.02, smallBusinessLimit: 500000 },
      NU: { name: "Nunavut", generalRate: 0.12, smallBusinessRate: 0.03, smallBusinessLimit: 500000 },
      YT: { name: "Yukon", generalRate: 0.12, smallBusinessRate: 0.00, smallBusinessLimit: 500000 }
    }
  };

  /* ---- Formatting ---- */

  function fmt$(v) { return v.toLocaleString("en-CA", {style:"currency",currency:"CAD",minimumFractionDigits:0,maximumFractionDigits:0}); }
  function fmtPct(v) { return (v * 100).toFixed(1) + "%"; }
  function fmtPct2(v) { return (v * 100).toFixed(2) + "%"; }

  /* ---- Calculation ---- */

  function calculate(inputs, taxData) {
    var f = taxData.federal;
    var provCode = inputs.province || "ON";
    var prov = taxData.provinces[provCode];
    if (!prov) prov = { name: provCode, generalRate: 0, smallBusinessRate: 0, smallBusinessLimit: 500000 };

    var activeIncome = Math.max(0, Math.round(inputs.activeIncome || 0));
    var passiveIncome = Math.max(0, Math.round(inputs.passiveIncome || 0));
    var capitalGains = Math.max(0, Math.round(inputs.capitalGains || 0));
    var eligibleDivReceived = Math.max(0, Math.round(inputs.eligibleDividends || 0));
    var nonEligibleDivReceived = Math.max(0, Math.round(inputs.nonEligibleDividends || 0));

    var taxableCapitalGains = capitalGains * f.capitalGainsInclusion;
    var cdaAddition = capitalGains * (1 - f.capitalGainsInclusion);
    var aggregateInvIncome = passiveIncome + taxableCapitalGains;

    /* ---- Part I: Active business income ---- */
    var fedSBLimit = f.smallBusinessLimit;
    var fedActiveSB = Math.min(activeIncome, fedSBLimit);
    var fedActiveGeneral = Math.max(0, activeIncome - fedSBLimit);
    var fedActiveTax = fedActiveSB * f.smallBusinessRate + fedActiveGeneral * f.generalRate;

    var provSBLimit = prov.smallBusinessLimit || 500000;
    var provActiveSB = Math.min(activeIncome, provSBLimit);
    var provActiveGeneral = Math.max(0, activeIncome - provSBLimit);
    var provActiveTax = provActiveSB * prov.smallBusinessRate + provActiveGeneral * prov.generalRate;

    /* ---- Part I: Investment income ---- */
    var fedInvestmentTax = aggregateInvIncome * f.aggregateInvestmentRate;
    var provInvestmentTax = aggregateInvIncome * prov.generalRate;

    /* ---- Part I totals ---- */
    var partIFederal = fedActiveTax + fedInvestmentTax;
    var partIProvincial = provActiveTax + provInvestmentTax;
    var partITotal = partIFederal + partIProvincial;

    /* ---- NERDTOH ---- */
    var nerdtoh = aggregateInvIncome * f.nerdtohRate;

    /* ---- CDA ---- */
    var cdaCredit = cdaAddition;

    /* ---- Part IV tax ---- */
    var partIVEligible = eligibleDivReceived * f.partIVEligibleRate;
    var partIVNonEligible = nonEligibleDivReceived * f.partIVNonEligibleRate;
    var partIVTotal = partIVEligible + partIVNonEligible;

    /* ---- ERDTOH ---- */
    var erdtoh = partIVEligible;

    /* ---- Total RDTOH ---- */
    var totalRDTOH = nerdtoh + erdtoh;

    /* ---- Total tax before refund ---- */
    var totalTaxBeforeRefund = partITotal + partIVTotal;

    /* ---- Dividend refund potential ---- */
    var requiredDividend = totalRDTOH / f.partIVEligibleRate;
    var maxRefund = totalRDTOH;

    /* ---- Effective tax rates ---- */
    var effectiveRate = activeIncome > 0 ? ((fedActiveTax + provActiveTax) / activeIncome) * 100 : 0;
    var combinedSBRate = (f.smallBusinessRate + prov.smallBusinessRate) * 100;
    var combinedGeneralRate = (f.generalRate + prov.generalRate) * 100;

    return {
      inputs: {
        activeIncome: activeIncome,
        passiveIncome: passiveIncome,
        capitalGains: capitalGains,
        eligibleDividendsReceived: eligibleDivReceived,
        nonEligibleDividendsReceived: nonEligibleDivReceived,
        province: prov.name,
        provinceCode: provCode
      },
      activeIncome: {
        total: activeIncome,
        fedSmallBizPortion: fedActiveSB,
        fedGeneralPortion: fedActiveGeneral,
        fedSmallBizTax: fedActiveTax - (fedActiveGeneral * f.generalRate),
        fedGeneralTax: fedActiveGeneral * f.generalRate,
        fedActiveTax: fedActiveTax,
        provSmallBizPortion: provActiveSB,
        provGeneralPortion: provActiveGeneral,
        provActiveTax: provActiveTax,
        totalActiveTax: fedActiveTax + provActiveTax,
        fedSmallBizRate: f.smallBusinessRate,
        fedGeneralRate: f.generalRate,
        provSmallBizRate: prov.smallBusinessRate,
        provGeneralRate: prov.generalRate,
        combinedSBRate: combinedSBRate,
        combinedGeneralRate: combinedGeneralRate,
        effectiveRate: effectiveRate
      },
      investmentIncome: {
        passiveIncome: passiveIncome,
        capitalGains: capitalGains,
        taxableCapitalGains: taxableCapitalGains,
        aggregateInvIncome: aggregateInvIncome,
        fedInvestmentTax: fedInvestmentTax,
        provInvestmentTax: provInvestmentTax,
        totalInvestmentTax: fedInvestmentTax + provInvestmentTax
      },
      partI: {
        federal: partIFederal,
        provincial: partIProvincial,
        total: partITotal
      },
      partIV: {
        eligibleDividends: eligibleDivReceived,
        nonEligibleDividends: nonEligibleDivReceived,
        taxOnEligible: partIVEligible,
        taxOnNonEligible: partIVNonEligible,
        total: partIVTotal
      },
      rdtoh: {
        nerdtoh: nerdtoh,
        erdtoh: erdtoh,
        total: totalRDTOH
      },
      refund: {
        maxRefund: maxRefund,
        requiredDividend: requiredDividend,
        refundRate: f.partIVEligibleRate
      },
      cda: {
        capitalGainsTotal: capitalGains,
        cdaAddition: cdaCredit
      },
      totalTaxBeforeRefund: totalTaxBeforeRefund,
      year: taxData.year
    };
  }

  /* ---- Render ---- */

  function irow(label, value, highlight) {
    return '<div class="estimator__result-item"><div class="estimator__result-label">' + label + '</div><div class="estimator__result-value' + (highlight ? ' estimator__result-value--highlight' : '') + '">' + value + '</div></div>';
  }

  function trow(label, value, cls) {
    return '<tr class="' + (cls || "") + '"><td>' + label + '</td><td class="rate-cell">' + value + '</td></tr>';
  }

  function render(r) {
    var h = "";
    h += '<h3 class="estimator__result-title">' + r.year + ' Corporate Tax Estimate &mdash; ' + r.inputs.province + '</h3>';

    /* Income summary */
    h += '<h4 class="estimator__section-title">Income Summary</h4>';
    h += '<div class="estimator__result-grid">';
    h += irow("Active business income", fmt$(r.inputs.activeIncome));
    h += irow("Passive investment income", fmt$(r.inputs.passiveIncome));
    h += irow("Capital gains (total)", fmt$(r.inputs.capitalGains));
    h += irow("Eligible dividends received", fmt$(r.inputs.eligibleDividendsReceived));
    h += irow("Non-eligible dividends received", fmt$(r.inputs.nonEligibleDividendsReceived));
    h += '</div>';

    /* Active business income tax */
    h += '<h4 class="estimator__section-title">Active Business Income Tax</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Active business income", fmt$(r.activeIncome.total));
    h += trow("Federal SBD portion @ " + fmtPct2(r.activeIncome.fedSmallBizRate), fmt$(r.activeIncome.fedActiveTax - r.activeIncome.fedGeneralTax), "text-muted");
    if (r.activeIncome.fedGeneralPortion > 0) {
      h += trow("Federal general portion @ " + fmtPct2(r.activeIncome.fedGeneralRate), fmt$(r.activeIncome.fedGeneralTax), "text-muted");
    }
    h += trow("Provincial SBD portion @ " + fmtPct2(r.activeIncome.provSmallBizRate), fmt$(r.activeIncome.provActiveTax - (r.activeIncome.provGeneralPortion * r.activeIncome.provGeneralRate)), "text-muted");
    if (r.activeIncome.provGeneralPortion > 0) {
      h += trow("Provincial general portion @ " + fmtPct2(r.activeIncome.provGeneralRate), fmt$(r.activeIncome.provGeneralPortion * r.activeIncome.provGeneralRate), "text-muted");
    }
    h += trow("Total active business tax", fmt$(r.activeIncome.totalActiveTax), true);
    h += trow("Active income effective rate", r.activeIncome.effectiveRate.toFixed(1) + "%");
    h += '</tbody></table>';

    /* Investment income tax */
    h += '<h4 class="estimator__section-title">Investment Income Tax</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Passive investment income", fmt$(r.investmentIncome.passiveIncome));
    h += trow("Capital gains (total)", fmt$(r.investmentIncome.capitalGains));
    h += trow("Taxable capital gains (50% inclusion)", fmt$(r.investmentIncome.taxableCapitalGains), "text-muted");
    h += trow("Aggregate investment income", fmt$(r.investmentIncome.aggregateInvIncome), true);
    h += trow("Federal tax on AII @ 38.67%", fmt$(r.investmentIncome.fedInvestmentTax), "text-muted");
    h += trow("Provincial tax on AII @ " + fmtPct2(r.activeIncome.provGeneralRate), fmt$(r.investmentIncome.provInvestmentTax), "text-muted");
    h += trow("Total investment income tax", fmt$(r.investmentIncome.totalInvestmentTax), true);
    h += '</tbody></table>';

    /* Part I summary */
    h += '<h4 class="estimator__section-title">Part I Tax</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Federal Part I tax", fmt$(r.partI.federal));
    h += trow("Provincial Part I tax", fmt$(r.partI.provincial));
    h += trow("Total Part I tax", fmt$(r.partI.total), true);
    h += '</tbody></table>';

    /* Part IV tax */
    h += '<h4 class="estimator__section-title">Part IV Tax (Dividends Received)</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Eligible dividends received", fmt$(r.partIV.eligibleDividends));
    h += trow("Part IV on eligible dividends @ 38.33%", fmt$(r.partIV.taxOnEligible), "text-muted");
    h += trow("Non-eligible dividends received", fmt$(r.partIV.nonEligibleDividends));
    h += trow("Part IV on non-eligible dividends @ 0%", fmt$(r.partIV.taxOnNonEligible), "text-muted");
    h += trow("Total Part IV tax", fmt$(r.partIV.total), true);
    h += '</tbody></table>';

    /* RDTOH */
    h += '<h4 class="estimator__section-title">Refundable Dividend Tax on Hand (RDTOH)</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("NERDTOH (30.67% of AII)", fmt$(r.rdtoh.nerdtoh), "text-muted");
    h += trow("ERDTOH (Part IV on eligible dividends)", fmt$(r.rdtoh.erdtoh), "text-muted");
    h += trow("Total RDTOH", fmt$(r.rdtoh.total), true);
    h += '</tbody></table>';

    /* Dividend refund */
    h += '<h4 class="estimator__section-title">Dividend Refund</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Maximum dividend refund", fmt$(r.refund.maxRefund), true);
    h += trow("Dividend required for full recovery", fmt$(r.refund.requiredDividend), true);
    h += trow("Refund rate per $ of dividend paid", fmtPct2(r.refund.refundRate));
    h += '</tbody></table>';

    /* Capital Dividend Account */
    h += '<h4 class="estimator__section-title">Capital Dividend Account (CDA)</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Capital gains (total)", fmt$(r.cda.capitalGainsTotal));
    h += trow("Non-taxable portion added to CDA (50%)", fmt$(r.cda.cdaAddition), true);
    h += '</tbody></table>';

    /* Summary */
    h += '<h4 class="estimator__section-title">Tax Summary</h4>';
    h += '<div class="estimator__result-grid">';
    h += irow("Part I tax", fmt$(r.partI.total));
    h += irow("Part IV tax", fmt$(r.partIV.total));
    h += irow("Total tax (before dividend refund)", fmt$(r.totalTaxBeforeRefund), true);
    h += irow("Total RDTOH (refundable pool)", fmt$(r.rdtoh.total));
    h += irow("Max potential refund", fmt$(r.refund.maxRefund));
    h += irow("Dividend to fully recover RDTOH", fmt$(r.refund.requiredDividend), true);
    h += irow("CDA credit available", fmt$(r.cda.cdaAddition));
    h += '</div>';

    h += '<p class="estimator__note">This estimate uses ' + r.year + ' corporate tax rates. It assumes the corporation is a CCPC throughout the year, entitled to the full small business deduction without sharing the business limit. It does not account for: additional refundable tax (ART), SBD phase-out over $10M taxable capital, associated corporation rules, manufacturing and processing deductions, investment tax credits, provincial RDTOH regimes, or the small business deduction grind on passive income over $50,000. The required dividend to fully recover RDTOH assumes a refund rate of 38.33% on taxable dividends paid. CDA additions may also include life insurance proceeds and non-taxable portions of capital gains. This is not tax advice.</p>';

    return h;
  }

  function renderBody(r) {
    var h = '';
    h += '<div class="estimator__result-grid">';
    h += irow("Active business income", fmt$(r.inputs.activeIncome));
    h += irow("Passive investment income", fmt$(r.inputs.passiveIncome));
    h += irow("Capital gains (total)", fmt$(r.inputs.capitalGains));
    h += irow("Part I tax", fmt$(r.partI.total));
    h += irow("Part IV tax", fmt$(r.partIV.total));
    h += irow("Total RDTOH", fmt$(r.rdtoh.total));
    h += irow("Tax before refund", fmt$(r.totalTaxBeforeRefund), true);
    h += irow("Required dividend to recover", fmt$(r.refund.requiredDividend));
    h += irow("CDA credit", fmt$(r.cda.cdaAddition));
    h += '</div>';
    return h;
  }

  function renderCompare(r1, r2) {
    var h = '<div class="estimator__compare">';
    h += '<div class="estimator__compare-col"><h3 class="estimator__result-title">' + r1.year + '</h3>' + renderBody(r1) + '</div>';
    h += '<div class="estimator__compare-col"><h3 class="estimator__result-title">' + r2.year + '</h3>' + renderBody(r2) + '</div>';
    h += '</div>';
    return h;
  }

  /* Cache for loaded comparison year data */
  var CACHED_RATES = null;

  function loadRates(callback) {
    if (CACHED_RATES) { callback(CACHED_RATES); return; }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "assets/data/corporate-rates.json", true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var raw = JSON.parse(xhr.responseText);
          CACHED_RATES = {};
          Object.keys(raw.years).forEach(function(y) {
            var yr = raw.years[y];
            CACHED_RATES[y] = {
              year: parseInt(y),
              federal: {
                generalRate: yr.federal.generalRate,
                smallBusinessRate: yr.federal.smallBusinessRate,
                smallBusinessLimit: yr.federal.smallBusinessLimit,
                aggregateInvestmentRate: 0.3867,
                nerdtohRate: 0.3067,
                partIVEligibleRate: 0.3833,
                partIVNonEligibleRate: 0.0,
                capitalGainsInclusion: 0.5
              },
              provinces: yr.provinces
            };
          });
          callback(CACHED_RATES);
        } catch(e) {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    xhr.onerror = function() { callback(null); };
    xhr.send();
  }

  /* ---- Init ---- */

  function init() {
    var form = document.getElementById("corp-estimator-form");
    if (!form) return;

    var activeEl = document.getElementById("corp-active-income");
    var passiveEl = document.getElementById("corp-passive-income");
    var capGainsEl = document.getElementById("corp-capital-gains");
    var eligibleDivEl = document.getElementById("corp-eligible-dividends");
    var nonEligibleDivEl = document.getElementById("corp-noneligible-dividends");
    var provSelect = document.getElementById("corp-province");
    var resultsEl = document.getElementById("corp-results");

    function getInputs() {
      return {
        province: provSelect ? provSelect.value : "ON",
        activeIncome: activeEl ? parseFloat(activeEl.value) || 0 : 0,
        passiveIncome: passiveEl ? parseFloat(passiveEl.value) || 0 : 0,
        capitalGains: capGainsEl ? parseFloat(capGainsEl.value) || 0 : 0,
        eligibleDividends: eligibleDivEl ? parseFloat(eligibleDivEl.value) || 0 : 0,
        nonEligibleDividends: nonEligibleDivEl ? parseFloat(nonEligibleDivEl.value) || 0 : 0
      };
    }

    function run() {
      var inputs = getInputs();
      var hasIncome = inputs.activeIncome > 0 || inputs.passiveIncome > 0 || inputs.capitalGains > 0 || inputs.eligibleDividends > 0 || inputs.nonEligibleDividends > 0;
      if (!hasIncome) { resultsEl.style.display = "none"; return; }

      var result = calculate(inputs, CORP);
      resultsEl.innerHTML = render(result);
      resultsEl.style.display = "block";
    }

    var allInputs = [activeEl, passiveEl, capGainsEl, eligibleDivEl, nonEligibleDivEl];
    for (var i = 0; i < allInputs.length; i++) {
      if (allInputs[i]) allInputs[i].addEventListener("input", run);
    }
    if (provSelect) provSelect.addEventListener("change", run);

    run();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
