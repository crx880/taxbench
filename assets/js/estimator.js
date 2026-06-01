/* ============================================================
   TaxBench – Personal Income Tax Estimator 2026
   Handles: salary, self-employment, rental, interest, capital
   gains, eligible dividends, non-eligible dividends.
   Federal + all 13 provinces/territories.
   ============================================================ */

(function () {
  "use strict";

  /* ---- 2026 Tax Data (embedded for offline) ---- */
  var TAX = {
    year: 2026,
    federal: {
      brackets: [
        {
          min: 0,
          max: 58523,
          rate: 0.14
        },
        {
          min: 58524,
          max: 117045,
          rate: 0.205
        },
        {
          min: 117046,
          max: 181440,
          rate: 0.26
        },
        {
          min: 181440,
          max: 258482,
          rate: 0.29
        },
        {
          min: 258482,
          max: null,
          rate: 0.33
        }
      ],
      basicPersonalAmount: 16452,
      bpaReductionThreshold: 181440,
      bpaMinimum: 14829,
      eligibleDividendGrossUp: 0.38,
      eligibleDividendCredit: 0.150198,
      nonEligibleDividendGrossUp: 0.15,
      nonEligibleDividendCredit: 0.09030099999999999,
      capitalGainsInclusion: 0.5
    },
    provinces: {
      AB: {
        name: "Alberta",
        brackets: [
          {
            min: 0,
            max: 51200,
            r: 0.08
          },
          {
            min: 51201,
            max: 154259,
            r: 0.1
          },
          {
            min: 154260,
            max: 185111,
            r: 0.12
          },
          {
            min: 185112,
            max: 246813,
            r: 0.13
          },
          {
            min: 246814,
            max: 370220,
            r: 0.14
          },
          {
            min: 370220,
            max: null,
            r: 0
          }
        ],
        bpa: 22769,
        edivTC: 0.0812,
        nedivTC: 0.0218
      },
      BC: {
        name: "British Columbia",
        brackets: [
          {
            min: 0,
            max: 50363,
            r: 0.0506
          },
          {
            min: 50364,
            max: 100728,
            r: 0.077
          },
          {
            min: 100729,
            max: 115648,
            r: 0.105
          },
          {
            min: 115649,
            max: 140430,
            r: 0.1229
          },
          {
            min: 140431,
            max: 190405,
            r: 0.147
          },
          {
            min: 190406,
            max: 265545,
            r: 0.168
          },
          {
            min: 265545,
            max: null,
            r: 0.205
          }
        ],
        bpa: 13216,
        edivTC: 0.12,
        nedivTC: 0.0196
      },
      MB: {
        name: "Manitoba",
        brackets: [
          {
            min: 0,
            max: 47000,
            r: 0.10800000000000001
          },
          {
            min: 47001,
            max: 100000,
            r: 0.1275
          },
          {
            min: 100001,
            max: null,
            r: 0.174
          }
        ],
        bpa: 15780,
        edivTC: 0.08,
        nedivTC: 0.0078000000000000005
      },
      NB: {
        name: "New Brunswick",
        brackets: [
          {
            min: 0,
            max: 52333,
            r: 0.094
          },
          {
            min: 52334,
            max: 104666,
            r: 0.14
          },
          {
            min: 104667,
            max: 193861,
            r: 0.16
          },
          {
            min: 193862,
            max: null,
            r: 0.195
          }
        ],
        bpa: 13396,
        edivTC: 0.14,
        nedivTC: 0.0275
      },
      NL: {
        name: "Newfoundland and Labrador",
        brackets: [
          {
            min: 0,
            max: 44678,
            r: 0.087
          },
          {
            min: 44689,
            max: 89354,
            r: 0.145
          },
          {
            min: 89355,
            max: 159528,
            r: 0.158
          },
          {
            min: 159529,
            max: 223340,
            r: 0.17800000000000002
          },
          {
            min: 223341,
            max: 285319,
            r: 0.198
          },
          {
            min: 285320,
            max: 570638,
            r: 0.20800000000000002
          },
          {
            min: 570639,
            max: 1141275,
            r: 0.213
          },
          {
            min: 1141275,
            max: null,
            r: 0.218
          }
        ],
        bpa: 11067,
        edivTC: 0.054000000000000006,
        nedivTC: 0.032
      },
      NS: {
        name: "Nova Scotia",
        brackets: [
          {
            min: 0,
            max: 30995,
            r: 0.08789999999999999
          },
          {
            min: 30996,
            max: 61991,
            r: 0.1495
          },
          {
            min: 61992,
            max: 97417,
            r: 0.16670000000000001
          },
          {
            min: 97418,
            max: 157124,
            r: 0.175
          },
          {
            min: 157125,
            max: null,
            r: 0.21
          }
        ],
        bpa: 11932,
        edivTC: 0.0885,
        nedivTC: 0.015
      },
      ON: {
        name: "Ontario",
        brackets: [
          {
            min: 0,
            max: 53891,
            r: 0.050499999999999996
          },
          {
            min: 53892,
            max: 107785,
            r: 0.0915
          },
          {
            min: 107786,
            max: 150000,
            r: 0.1116
          },
          {
            min: 150001,
            max: 220000,
            r: 0.1216
          },
          {
            min: 220001,
            max: null,
            r: 0.1316
          }
        ],
        bpa: 12989,
        edivTC: 0.1,
        nedivTC: 0.029900000000000003,
        surtaxT1: 5818,
        surtaxR1: 0.2,
        surtaxT2: 7446,
        surtaxR2: 0.36,
        healthPremium: [
          {
            max: 20000,
            p: 0
          },
          {
            max: 25000,
            p: 60
          },
          {
            max: 29000,
            p: 120
          },
          {
            max: 33000,
            p: 180
          },
          {
            max: 36000,
            p: 240
          },
          {
            max: 38540,
            p: 300
          },
          {
            max: 44000,
            p: 300
          },
          {
            max: 48000,
            p: 360
          },
          {
            max: 48500,
            p: 450
          },
          {
            max: 50600,
            p: 480
          },
          {
            max: 55000,
            p: 570
          },
          {
            max: 56500,
            p: 600
          },
          {
            max: 72600,
            p: 600
          },
          {
            max: 73600,
            p: 750
          },
          {
            max: 200000,
            p: 750
          },
          {
            max: 200600,
            p: 900
          },
          {
            max: null,
            p: 900
          }
        ]
      },
      PE: {
        name: "Prince Edward Island",
        brackets: [
          {
            min: 0,
            max: 33928,
            r: 0.095
          },
          {
            min: 33929,
            max: 65820,
            r: 0.13470000000000001
          },
          {
            min: 65821,
            max: 106890,
            r: 0.166
          },
          {
            min: 106891,
            max: 142250,
            r: 0
          },
          {
            min: 142250,
            max: null,
            r: 0
          }
        ],
        bpa: 14650,
        edivTC: 0.105,
        nedivTC: 0.0195
      },
      QC: {
        name: "Quebec",
        brackets: [
          {
            min: 0,
            max: 53178,
            r: 0.14
          },
          {
            min: 53179,
            max: 106341,
            r: 0.19
          },
          {
            min: 106342,
            max: 129402,
            r: 0.24
          },
          {
            min: 129403,
            max: null,
            r: 0.2575
          }
        ],
        bpa: 18952,
        edivTC: 0.11699999999999999,
        nedivTC: 0.0342,
        abatement: 0.165
      },
      SK: {
        name: "Saskatchewan",
        brackets: [
          {
            min: 0,
            max: 54532,
            r: 0.105
          },
          {
            min: 54533,
            max: 155805,
            r: 0.125
          },
          {
            min: 155806,
            max: null,
            r: 0.145
          }
        ],
        bpa: 20381,
        edivTC: 0.11,
        nedivTC: 0.0252
      },
      NT: {
        name: "Northwest Territories",
        brackets: [
          {
            min: 0,
            max: 53003,
            r: 0.059000000000000004
          },
          {
            min: 53004,
            max: 106009,
            r: 0.086
          },
          {
            min: 106010,
            max: 172346,
            r: 0.122
          },
          {
            min: 172347,
            max: null,
            r: 0.1405
          }
        ],
        bpa: 16452,
        edivTC: 0.115,
        nedivTC: 0.0356
      },
      NU: {
        name: "Nunavut",
        brackets: [
          {
            min: 0,
            max: 52477,
            r: 0.04
          },
          {
            min: 52478,
            max: 104953,
            r: 0.07
          },
          {
            min: 104954,
            max: 170565,
            r: 0.09
          },
          {
            min: 170566,
            max: null,
            r: 0.115
          }
        ],
        bpa: 16452,
        edivTC: 0.055099999999999996,
        nedivTC: 0.022099999999999998
      },
      YT: {
        name: "Yukon",
        brackets: [
          {
            min: 0,
            max: 58523,
            r: 0.064
          },
          {
            min: 58524,
            max: 117045,
            r: 0.09
          },
          {
            min: 117046,
            max: 181440,
            r: 0.109
          },
          {
            min: 181441,
            max: 500000,
            r: 0.128
          },
          {
            min: 500000,
            max: null,
            r: 0.15
          }
        ],
        bpa: 16452,
        edivTC: 0.1202,
        nedivTC: 0.023
      }
    }
  };

  /* ---- Calculation helpers ---- */

  function bracketTax(income, brackets) {
    var tax = 0, marginal = 0, detail = [];
    for (var i = 0; i < brackets.length; i++) {
      var b = brackets[i], bMin = b.min, bMax = b.max, rate = b.r !== undefined ? b.r : b.rate;
      if (income <= bMin - 1) break;
      var top = Math.min(income, bMax === Infinity ? income : bMax);
      var amt = top - bMin + 1;
      var t = Math.max(0, amt * rate);
      tax += t;
      if (amt > 0) { detail.push({ min: bMin, max: top, rate: rate, amount: amt, tax: t }); marginal = rate; }
    }
    return { tax: tax, marginal: marginal, detail: detail };
  }

  function fedBPA(income) {
    var f = TAX.federal;
    if (income <= f.bpaReductionThreshold) return f.basicPersonalAmount;
    var reduced = f.basicPersonalAmount - (income - f.bpaReductionThreshold) * 0.15;
    return Math.max(f.bpaMinimum, reduced);
  }

  function healthPremiumON(income) {
    var tiers = TAX.provinces.ON.healthPremium;
    for (var i = 0; i < tiers.length; i++) { if (income <= tiers[i].max) return tiers[i].p; }
    return tiers[tiers.length-1].p;
  }

  /* ============ Main calculation ============ */

  function calculate(inputs) {
    var f = TAX.federal;

    var emp       = Math.max(0, Math.round(inputs.employment || 0));
    var se        = Math.max(0, Math.round(inputs.selfEmployment || 0));
    var rental    = Math.max(0, Math.round(inputs.rental || 0));
    var interest  = Math.max(0, Math.round(inputs.interest || 0));
    var capGain   = Math.max(0, Math.round(inputs.capitalGains || 0));
    var elecDiv   = Math.max(0, Math.round(inputs.eligibleDividends || 0));
    var nonElecDiv= Math.max(0, Math.round(inputs.nonEligibleDividends || 0));

    var taxableCapGain = capGain * f.capitalGainsInclusion;
    var eligibleGrossUp = elecDiv * f.eligibleDividendGrossUp;
    var nonEligibleGrossUp = nonElecDiv * f.nonEligibleDividendGrossUp;

    var taxableEligibleDiv = elecDiv + eligibleGrossUp;
    var taxableNonEligibleDiv = nonElecDiv + nonEligibleGrossUp;

    var totalOrdinaryIncome = emp + se + rental + interest;
    var taxableIncome = totalOrdinaryIncome + taxableCapGain + taxableEligibleDiv + taxableNonEligibleDiv;
    var totalIncome = emp + se + rental + interest + capGain + elecDiv + nonElecDiv;

    var provCode = inputs.province || "ON";
    var prov = TAX.provinces[provCode];

    /* Federal tax */
    var fedBracketTax = bracketTax(taxableIncome, f.brackets);
    var fedBPAVal = fedBPA(taxableIncome);
    var fedBPACredit = fedBPAVal * f.brackets[0].rate;

    var fedDTC = taxableEligibleDiv * f.eligibleDividendCredit
               + taxableNonEligibleDiv * f.nonEligibleDividendCredit;

    var fedTaxBeforeAbatement = Math.max(0, fedBracketTax.tax - fedBPACredit - fedDTC);
    var abatement = 0;
    if (provCode === "QC") {
      abatement = fedTaxBeforeAbatement * prov.abatement;
    }
    var federalTax = Math.max(0, fedTaxBeforeAbatement - abatement);

    /* Provincial tax */
    var provBracketTax = { tax: 0, marginal: 0, detail: [] };
    var provBPACredit = 0;
    var provDTC = 0;
    var provTaxBeforeCredits = 0;
    var surtax = 0;
    var healthPrem = 0;

    if (prov) {
      provBracketTax = bracketTax(taxableIncome, prov.brackets);
      provTaxBeforeCredits = provBracketTax.tax;
      var provBPAVal = prov.bpa;
      provBPACredit = provBPAVal * (prov.brackets[0].r !== undefined ? prov.brackets[0].r : prov.brackets[0].rate);

      provDTC = taxableEligibleDiv * (prov.edivTC || 0)
              + taxableNonEligibleDiv * (prov.nedivTC || 0);

      var provAfterCredits = Math.max(0, provTaxBeforeCredits - provBPACredit - provDTC);

      if (provCode === "ON") {
        surtax = 0;
        if (provAfterCredits > prov.surtaxT1) surtax += (provAfterCredits - prov.surtaxT1) * prov.surtaxR1;
        if (provAfterCredits > prov.surtaxT2) surtax += (provAfterCredits - prov.surtaxT2) * prov.surtaxR2;
        healthPrem = healthPremiumON(taxableIncome);
      }
    }

    var provincialTax = Math.max(0, provTaxBeforeCredits - provBPACredit - provDTC) + surtax + healthPrem;

    var totalTax = federalTax + provincialTax;

    var marginalFed = fedBracketTax.marginal;
    var marginalProv = provBracketTax.marginal;

    return {
      income: {
        employment: emp, selfEmployment: se, rental: rental,
        interest: interest, capitalGains: capGain,
        eligibleDividends: elecDiv, nonEligibleDividends: nonElecDiv,
        total: totalIncome
      },
      taxable: {
        ordinary: totalOrdinaryIncome,
        capitalGainsIncluded: taxableCapGain,
        eligibleDividendsGrossedUp: taxableEligibleDiv,
        nonEligibleDividendsGrossedUp: taxableNonEligibleDiv,
        total: taxableIncome,
        capGainExcluded: capGain - taxableCapGain,
        eligibleGrossUp: eligibleGrossUp,
        nonEligibleGrossUp: nonEligibleGrossUp
      },
      federal: {
        bracketTax: fedBracketTax.tax,
        bracketDetail: fedBracketTax.detail,
        bpaValue: fedBPAVal,
        bpaCredit: fedBPACredit,
        dividendTaxCredit: fedDTC,
        beforeAbatement: fedTaxBeforeAbatement,
        abatement: abatement,
        payable: federalTax,
        marginal: marginalFed
      },
      provincial: {
        code: provCode,
        name: prov ? prov.name : provCode,
        bracketTax: provBracketTax.tax,
        bracketDetail: provBracketTax.detail,
        bpaValue: prov ? prov.bpa : 0,
        bpaCredit: provBPACredit,
        dividendTaxCredit: provDTC,
        surtax: surtax,
        healthPremium: healthPrem,
        payable: provincialTax,
        marginal: marginalProv
      },
      totalTax: totalTax,
      afterTax: totalIncome - totalTax,
      averageRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
      marginalCombined: marginalFed + marginalProv,
      province: prov ? prov.name : provCode,
      year: TAX.year
    };
  }

  /* ---- Formatting ---- */

  function fmt$(v) { return v.toLocaleString("en-CA", {style:"currency",currency:"CAD",minimumFractionDigits:0,maximumFractionDigits:0}); }
  function fmtPct(v) { return v.toFixed(1) + "%"; }
  function fmtPct2(v) { return (v * 100).toFixed(2) + "%"; }

  /* ---- Render results ---- */

  function render(r) {
    var h = "";
    h += '<h3 class="estimator__result-title">' + r.year + ' Tax Estimate &mdash; ' + r.province + '</h3>';

    h += '<h4 class="estimator__section-title">Income Summary</h4>';
    h += '<div class="estimator__result-grid">';
    h += irow("Employment income", fmt$(r.income.employment));
    h += irow("Self-employment income", fmt$(r.income.selfEmployment));
    h += irow("Rental income", fmt$(r.income.rental));
    h += irow("Interest income", fmt$(r.income.interest));
    h += irow("Capital gains (total)", fmt$(r.income.capitalGains));
    h += irow("Eligible dividends", fmt$(r.income.eligibleDividends));
    h += irow("Non-eligible dividends", fmt$(r.income.nonEligibleDividends));
    h += irow("Total income", fmt$(r.income.total), true);
    h += '</div>';

    h += '<h4 class="estimator__section-title">Taxable Income Calculation</h4>';
    h += '<table class="tax-table"><tbody>';
    h += trow("Total income", fmt$(r.income.total));
    h += trow("Less: non-taxable capital gains (50%)", fmt$(-r.taxable.capGainExcluded), "text-muted");
    h += trow("Add: eligible dividend gross-up (38%)", fmt$(r.taxable.eligibleGrossUp), "text-muted");
    h += trow("Add: non-eligible dividend gross-up (15%)", fmt$(r.taxable.nonEligibleGrossUp), "text-muted");
    h += trow("Taxable income", fmt$(r.taxable.total), true);
    h += '</tbody></table>';

    h += '<h4 class="estimator__section-title">Federal Tax</h4>';
    h += '<table class="tax-table"><tbody>';
    for (var i = 0; i < r.federal.bracketDetail.length; i++) {
      var bd = r.federal.bracketDetail[i];
      h += trow("Bracket " + fmt$(bd.min) + " &ndash; " + (bd.max === Infinity ? "&infin;" : fmt$(bd.max)) + " @ " + fmtPct2(bd.rate), fmt$(bd.tax), "text-muted");
    }
    h += trow("Federal tax before credits", fmt$(r.federal.bracketTax));
    h += trow("Less: basic personal amount ($" + r.federal.bpaValue.toLocaleString() + " &times; " + fmtPct2(TAX.federal.brackets[0].rate) + ")", fmt$(-r.federal.bpaCredit), "text-muted");
    if (r.federal.dividendTaxCredit > 0) {
      h += trow("Less: federal dividend tax credit", fmt$(-r.federal.dividendTaxCredit), "text-muted");
    }
    if (r.federal.abatement > 0) {
      h += trow("Less: Quebec abatement (16.5%)", fmt$(-r.federal.abatement), "text-muted");
    }
    h += trow("Federal tax payable", fmt$(r.federal.payable), true);
    h += '</tbody></table>';

    h += '<h4 class="estimator__section-title">Provincial Tax &mdash; ' + r.province + '</h4>';
    if (r.provincial.bracketDetail.length > 0) {
      h += '<table class="tax-table"><tbody>';
      for (var j = 0; j < r.provincial.bracketDetail.length; j++) {
        var pd = r.provincial.bracketDetail[j];
        h += trow("Bracket " + fmt$(pd.min) + " &ndash; " + (pd.max === Infinity ? "&infin;" : fmt$(pd.max)) + " @ " + fmtPct2(pd.rate), fmt$(pd.tax), "text-muted");
      }
      h += trow("Provincial tax before credits", fmt$(r.provincial.bracketTax));
      h += trow("Less: provincial basic personal amount ($" + r.provincial.bpaValue.toLocaleString() + " &times; lowest rate)", fmt$(-r.provincial.bpaCredit), "text-muted");
      if (r.provincial.dividendTaxCredit > 0) {
        h += trow("Less: provincial dividend tax credit", fmt$(-r.provincial.dividendTaxCredit), "text-muted");
      }
      if (r.provincial.surtax > 0) {
        h += trow("Add: Ontario surtax", fmt$(r.provincial.surtax), "text-muted");
      }
      if (r.provincial.healthPremium > 0) {
        h += trow("Add: Ontario Health Premium", fmt$(r.provincial.healthPremium), "text-muted");
      }
      h += trow("Provincial tax payable", fmt$(r.provincial.payable), true);
      h += '</tbody></table>';
    } else {
      h += '<p class="text-muted">No provincial tax (non-resident).</p>';
    }

    h += '<h4 class="estimator__section-title">Summary</h4>';
    h += '<div class="estimator__result-grid">';
    h += irow("Total tax", fmt$(r.totalTax), true);
    h += irow("After-tax income", fmt$(r.afterTax));
    h += irow("Average tax rate", fmtPct(r.averageRate), true);
    h += irow("Marginal rate (next $ of ordinary income)", fmtPct2(r.marginalCombined));
    h += '</div>';

    h += '<p class="estimator__note">This estimate uses ' + r.year + ' tax brackets and rates. It accounts for: progressive federal and provincial brackets, basic personal amounts, dividend gross-up and tax credits, non-taxable portion of capital gains, Ontario surtax and health premium, and Quebec abatement. It does not account for: other non-refundable credits (medical, tuition, disability, age, spousal), deductions (RRSP, child care, employment expenses), CPP/EI contributions, or refundable credits (CWB, GST/HST). This is not tax advice.</p>';

    return h;
  }

  function irow(label, value, highlight) {
    return '<div class="estimator__result-item"><div class="estimator__result-label">' + label + '</div><div class="estimator__result-value' + (highlight ? ' estimator__result-value--highlight' : '') + '">' + value + '</div></div>';
  }

  function trow(label, value, cls) {
    return '<tr class="' + (cls || "") + '"><td>' + label + '</td><td class="rate-cell">' + value + '</td></tr>';
  }

  function calculateWith(inputs, taxObj) {
    var saveTAX = TAX;
    TAX = taxObj;
    var result = calculate(inputs);
    TAX = saveTAX;
    return result;
  }

  function renderCompare(r1, r2) {
    var h = '<div class="estimator__compare">';
    h += '<div class="estimator__compare-col"><h3 class="estimator__result-title">' + r1.year + '</h3>' + renderBody(r1) + '</div>';
    h += '<div class="estimator__compare-col"><h3 class="estimator__result-title">' + r2.year + '</h3>' + renderBody(r2) + '</div>';
    h += '</div>';
    return h;
  }

  function renderBody(r) {
    var h = '';
    h += '<div class="estimator__result-grid">';
    h += irow("Total income", fmt$(r.income.total));
    h += irow("Taxable income", fmt$(r.taxable.total));
    h += irow("Federal tax", fmt$(r.federal.payable));
    h += irow("Provincial tax", fmt$(r.provincial.payable));
    h += irow("Total tax", fmt$(r.totalTax), true);
    h += irow("After-tax income", fmt$(r.afterTax));
    h += irow("Average rate", fmtPct(r.averageRate), true);
    h += irow("Marginal rate", fmtPct2(r.marginalCombined));
    h += '</div>';
    return h;
  }

  /* Cache for loaded comparison year data */
  var CACHED_TAX = {};

  function loadCompareYear(year, callback) {
    if (CACHED_TAX[year]) { callback(CACHED_TAX[year]); return; }
    /* Check embedded COMPARE_YEARS first (no XHR needed) */
    if (typeof COMPARE_YEARS !== "undefined" && COMPARE_YEARS[year]) {
      CACHED_TAX[year] = COMPARE_YEARS[year];
      callback(CACHED_TAX[year]);
      return;
    }
    /* Fallback to XHR for years not in the embedded data */
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "assets/data/rates-" + year + ".json", true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var taxObj = {
            year: parseInt(year),
            federal: {
              brackets: data.federal.brackets.map(function(b) {
                return { min: b.min, max: b.max === null ? Infinity : b.max, rate: b.rate };
              }),
              basicPersonalAmount: data.federal.basicPersonalAmount,
              bpaReductionThreshold: data.federal.bpaReductionThreshold || 99999999,
              bpaMinimum: data.federal.bpaMinimum || data.federal.basicPersonalAmount,
              eligibleDividendGrossUp: data.federal.eligibleDividendGrossUp || 0.38,
              eligibleDividendCredit: data.federal.eligibleDividendCredit || 0.150198,
              nonEligibleDividendGrossUp: data.federal.nonEligibleDividendGrossUp || 0.15,
              nonEligibleDividendCredit: data.federal.nonEligibleDividendCredit || 0.090301,
              capitalGainsInclusion: data.federal.capitalGainsInclusion || 0.5
            },
            provinces: {}
          };
          if (data.provinces) {
            Object.keys(data.provinces).forEach(function(code) {
              var p = data.provinces[code];
              taxObj.provinces[code] = {
                name: p.name || code,
                brackets: (p.brackets || []).map(function(b) {
                  return { min: b.min, max: b.max === null ? Infinity : b.max, r: b.r !== undefined ? b.r : b.rate, rate: b.rate };
                }),
                bpa: p.bpa || p.basicPersonalAmount || 0,
                edivTC: p.edivTC || 0,
                nedivTC: p.nedivTC || 0,
                surtaxT1: p.surtaxT1, surtaxR1: p.surtaxR1,
                surtaxT2: p.surtaxT2, surtaxR2: p.surtaxR2,
                abatement: p.abatement,
                healthPremium: p.healthPremium
              };
            });
          }
          CACHED_TAX[year] = taxObj;
          callback(taxObj);
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
    var form = document.getElementById("estimator-form");
    if (!form) return;

    var fields = ["employment","selfEmployment","rental","interest","capitalGains","eligibleDividends","nonEligibleDividends"];
    var provSelect = document.getElementById("estimator-province");
    var resultsEl = document.getElementById("estimator-results");
    var compareToggle = document.getElementById("estimator-compare");
    var compareYear = document.getElementById("estimator-compare-year");

    function run() {
      var inputs = { province: provSelect ? provSelect.value : "ON" };
      var hasIncome = false;
      for (var i = 0; i < fields.length; i++) {
        var el = document.getElementById("est-" + fields[i]);
        var val = el ? parseFloat(el.value) || 0 : 0;
        inputs[fields[i]] = val;
        if (val > 0) hasIncome = true;
      }
      if (!hasIncome) { resultsEl.style.display = "none"; return; }

      var result = calculate(inputs);
      if (compareToggle && compareToggle.checked && compareYear && typeof COMPARE_YEARS !== "undefined") {
        var cy = compareYear.value;
        var taxObj = COMPARE_YEARS[cy];
        if (taxObj) {
          try {
            var result2 = calculateWith(inputs, taxObj);
            resultsEl.innerHTML = renderCompare(result, result2);
          } catch(e) {
            resultsEl.innerHTML = render(result) + '<p class="estimator__note">Error comparing with ' + cy + ': ' + e.message + '</p>';
          }
        } else {
          resultsEl.innerHTML = render(result) + '<p class="estimator__note">No data available for ' + cy + '. Try a different year.</p>';
        }
      } else {
        resultsEl.innerHTML = render(result);
      }
      resultsEl.style.display = "block";
    }

    for (var i = 0; i < fields.length; i++) {
      var el = document.getElementById("est-" + fields[i]);
      if (el) el.addEventListener("input", run);
    }
    if (provSelect) provSelect.addEventListener("change", run);
    if (compareToggle) compareToggle.addEventListener("change", run);
    if (compareYear) compareYear.addEventListener("change", run);

    run();
  }

  function renderBody(r) {
    var h = '';
    h += '<div class="estimator__result-grid">';
    h += irow("Total income", fmt$(r.income.total));
    h += irow("Taxable income", fmt$(r.taxable.total));
    h += irow("Federal tax", fmt$(r.federal.payable));
    h += irow("Provincial tax", fmt$(r.provincial.payable));
    h += irow("Total tax", fmt$(r.totalTax), true);
    h += irow("After-tax income", fmt$(r.afterTax));
    h += irow("Average rate", fmtPct(r.averageRate), true);
    h += irow("Marginal rate", fmtPct2(r.marginalCombined));
    h += '</div>';
    return h;
  }

  /* ---- Init ---- */

  function init() {
    var form = document.getElementById("estimator-form");
    if (!form) return;

    var fields = ["employment","selfEmployment","rental","interest","capitalGains","eligibleDividends","nonEligibleDividends"];
    var provSelect = document.getElementById("estimator-province");
    var resultsEl = document.getElementById("estimator-results");
    var compareToggle = document.getElementById("estimator-compare");

    function run() {
      var inputs = { province: provSelect ? provSelect.value : "ON" };
      var hasIncome = false;
      for (var i = 0; i < fields.length; i++) {
        var el = document.getElementById("est-" + fields[i]);
        var val = el ? parseFloat(el.value) || 0 : 0;
        inputs[fields[i]] = val;
        if (val > 0) hasIncome = true;
      }
      if (!hasIncome) { resultsEl.style.display = "none"; return; }

      var result = calculate(inputs);
      if (compareToggle && compareToggle.checked) {
        var result2 = calculateWith(inputs, TAX2);
        resultsEl.innerHTML = renderCompare(result, result2);
      } else {
        resultsEl.innerHTML = render(result);
      }
      resultsEl.style.display = "block";
    }

    for (var i = 0; i < fields.length; i++) {
      var el = document.getElementById("est-" + fields[i]);
      if (el) el.addEventListener("input", run);
    }
    if (provSelect) provSelect.addEventListener("change", run);
    if (compareToggle) compareToggle.addEventListener("change", run);

    /* Expose run globally so inline onchange on checkbox works */
    window.runEstimator = run;

    run();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
