// Local storage manager
'use strict';

const Storage = {
  prefix: 'fenceDepot:',
  save(key, data) {
    try { window.localStorage.setItem(this.prefix + key, JSON.stringify(data)); return true; }
    catch (error) { console.error('Storage save failed:', error); return false; }
  },
  load(key) {
    try { const payload = window.localStorage.getItem(this.prefix + key); return payload ? JSON.parse(payload) : null; }
    catch (error) { console.error('Storage load failed:', error); return null; }
  },
  remove(key) { window.localStorage.removeItem(this.prefix + key); },
  saveProject(projectData) { return this.save('project', projectData); },
  loadProject() { return this.load('project'); },
  saveEstimate(estimateData) { return this.save('estimate', estimateData); },
  loadEstimate() { return this.load('estimate'); },
  autoSave(interval = 60000) { if (this._intervalId) window.clearInterval(this._intervalId); this._intervalId = window.setInterval(() => { if (window.App) App.saveAll(); }, interval); },
  clearAll() { Object.keys(window.localStorage).filter((key) => key.startsWith(this.prefix)).forEach((key) => window.localStorage.removeItem(key)); }
};
window.Storage = Storage;

Storage[`saveCollection_1`] = function saveCollection_1(data) { return this.save('collection-1', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_2`] = function saveCollection_2(data) { return this.save('collection-2', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_3`] = function saveCollection_3(data) { return this.save('collection-3', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_4`] = function saveCollection_4(data) { return this.save('collection-4', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_5`] = function saveCollection_5(data) { return this.save('collection-5', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_6`] = function saveCollection_6(data) { return this.save('collection-6', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_7`] = function saveCollection_7(data) { return this.save('collection-7', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_8`] = function saveCollection_8(data) { return this.save('collection-8', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_9`] = function saveCollection_9(data) { return this.save('collection-9', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_10`] = function saveCollection_10(data) { return this.save('collection-10', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_11`] = function saveCollection_11(data) { return this.save('collection-11', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_12`] = function saveCollection_12(data) { return this.save('collection-12', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_13`] = function saveCollection_13(data) { return this.save('collection-13', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_14`] = function saveCollection_14(data) { return this.save('collection-14', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_15`] = function saveCollection_15(data) { return this.save('collection-15', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_16`] = function saveCollection_16(data) { return this.save('collection-16', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_17`] = function saveCollection_17(data) { return this.save('collection-17', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_18`] = function saveCollection_18(data) { return this.save('collection-18', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_19`] = function saveCollection_19(data) { return this.save('collection-19', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_20`] = function saveCollection_20(data) { return this.save('collection-20', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_21`] = function saveCollection_21(data) { return this.save('collection-21', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_22`] = function saveCollection_22(data) { return this.save('collection-22', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_23`] = function saveCollection_23(data) { return this.save('collection-23', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_24`] = function saveCollection_24(data) { return this.save('collection-24', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_25`] = function saveCollection_25(data) { return this.save('collection-25', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_26`] = function saveCollection_26(data) { return this.save('collection-26', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_27`] = function saveCollection_27(data) { return this.save('collection-27', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_28`] = function saveCollection_28(data) { return this.save('collection-28', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_29`] = function saveCollection_29(data) { return this.save('collection-29', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_30`] = function saveCollection_30(data) { return this.save('collection-30', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_31`] = function saveCollection_31(data) { return this.save('collection-31', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_32`] = function saveCollection_32(data) { return this.save('collection-32', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_33`] = function saveCollection_33(data) { return this.save('collection-33', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_34`] = function saveCollection_34(data) { return this.save('collection-34', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_35`] = function saveCollection_35(data) { return this.save('collection-35', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_36`] = function saveCollection_36(data) { return this.save('collection-36', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_37`] = function saveCollection_37(data) { return this.save('collection-37', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_38`] = function saveCollection_38(data) { return this.save('collection-38', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_39`] = function saveCollection_39(data) { return this.save('collection-39', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_40`] = function saveCollection_40(data) { return this.save('collection-40', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_41`] = function saveCollection_41(data) { return this.save('collection-41', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_42`] = function saveCollection_42(data) { return this.save('collection-42', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_43`] = function saveCollection_43(data) { return this.save('collection-43', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_44`] = function saveCollection_44(data) { return this.save('collection-44', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_45`] = function saveCollection_45(data) { return this.save('collection-45', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_46`] = function saveCollection_46(data) { return this.save('collection-46', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_47`] = function saveCollection_47(data) { return this.save('collection-47', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_48`] = function saveCollection_48(data) { return this.save('collection-48', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_49`] = function saveCollection_49(data) { return this.save('collection-49', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_50`] = function saveCollection_50(data) { return this.save('collection-50', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_51`] = function saveCollection_51(data) { return this.save('collection-51', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_52`] = function saveCollection_52(data) { return this.save('collection-52', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_53`] = function saveCollection_53(data) { return this.save('collection-53', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_54`] = function saveCollection_54(data) { return this.save('collection-54', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_55`] = function saveCollection_55(data) { return this.save('collection-55', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_56`] = function saveCollection_56(data) { return this.save('collection-56', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_57`] = function saveCollection_57(data) { return this.save('collection-57', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_58`] = function saveCollection_58(data) { return this.save('collection-58', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_59`] = function saveCollection_59(data) { return this.save('collection-59', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_60`] = function saveCollection_60(data) { return this.save('collection-60', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_61`] = function saveCollection_61(data) { return this.save('collection-61', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_62`] = function saveCollection_62(data) { return this.save('collection-62', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_63`] = function saveCollection_63(data) { return this.save('collection-63', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_64`] = function saveCollection_64(data) { return this.save('collection-64', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_65`] = function saveCollection_65(data) { return this.save('collection-65', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_66`] = function saveCollection_66(data) { return this.save('collection-66', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_67`] = function saveCollection_67(data) { return this.save('collection-67', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_68`] = function saveCollection_68(data) { return this.save('collection-68', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_69`] = function saveCollection_69(data) { return this.save('collection-69', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_70`] = function saveCollection_70(data) { return this.save('collection-70', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_71`] = function saveCollection_71(data) { return this.save('collection-71', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_72`] = function saveCollection_72(data) { return this.save('collection-72', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_73`] = function saveCollection_73(data) { return this.save('collection-73', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_74`] = function saveCollection_74(data) { return this.save('collection-74', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_75`] = function saveCollection_75(data) { return this.save('collection-75', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_76`] = function saveCollection_76(data) { return this.save('collection-76', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_77`] = function saveCollection_77(data) { return this.save('collection-77', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_78`] = function saveCollection_78(data) { return this.save('collection-78', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_79`] = function saveCollection_79(data) { return this.save('collection-79', Array.isArray(data) ? data : [data]); };

Storage[`saveCollection_80`] = function saveCollection_80(data) { return this.save('collection-80', Array.isArray(data) ? data : [data]); };

Storage[`loadCollection_1`] = function loadCollection_1() { return this.load('collection-1') || []; };

Storage[`loadCollection_2`] = function loadCollection_2() { return this.load('collection-2') || []; };

Storage[`loadCollection_3`] = function loadCollection_3() { return this.load('collection-3') || []; };

Storage[`loadCollection_4`] = function loadCollection_4() { return this.load('collection-4') || []; };

Storage[`loadCollection_5`] = function loadCollection_5() { return this.load('collection-5') || []; };

Storage[`loadCollection_6`] = function loadCollection_6() { return this.load('collection-6') || []; };

Storage[`loadCollection_7`] = function loadCollection_7() { return this.load('collection-7') || []; };

Storage[`loadCollection_8`] = function loadCollection_8() { return this.load('collection-8') || []; };

Storage[`loadCollection_9`] = function loadCollection_9() { return this.load('collection-9') || []; };

Storage[`loadCollection_10`] = function loadCollection_10() { return this.load('collection-10') || []; };

Storage[`loadCollection_11`] = function loadCollection_11() { return this.load('collection-11') || []; };

Storage[`loadCollection_12`] = function loadCollection_12() { return this.load('collection-12') || []; };

Storage[`loadCollection_13`] = function loadCollection_13() { return this.load('collection-13') || []; };

Storage[`loadCollection_14`] = function loadCollection_14() { return this.load('collection-14') || []; };

Storage[`loadCollection_15`] = function loadCollection_15() { return this.load('collection-15') || []; };

Storage[`loadCollection_16`] = function loadCollection_16() { return this.load('collection-16') || []; };

Storage[`loadCollection_17`] = function loadCollection_17() { return this.load('collection-17') || []; };

Storage[`loadCollection_18`] = function loadCollection_18() { return this.load('collection-18') || []; };

Storage[`loadCollection_19`] = function loadCollection_19() { return this.load('collection-19') || []; };

Storage[`loadCollection_20`] = function loadCollection_20() { return this.load('collection-20') || []; };

Storage[`loadCollection_21`] = function loadCollection_21() { return this.load('collection-21') || []; };

Storage[`loadCollection_22`] = function loadCollection_22() { return this.load('collection-22') || []; };

Storage[`loadCollection_23`] = function loadCollection_23() { return this.load('collection-23') || []; };

Storage[`loadCollection_24`] = function loadCollection_24() { return this.load('collection-24') || []; };

Storage[`loadCollection_25`] = function loadCollection_25() { return this.load('collection-25') || []; };

Storage[`loadCollection_26`] = function loadCollection_26() { return this.load('collection-26') || []; };

Storage[`loadCollection_27`] = function loadCollection_27() { return this.load('collection-27') || []; };

Storage[`loadCollection_28`] = function loadCollection_28() { return this.load('collection-28') || []; };

Storage[`loadCollection_29`] = function loadCollection_29() { return this.load('collection-29') || []; };

Storage[`loadCollection_30`] = function loadCollection_30() { return this.load('collection-30') || []; };

Storage[`loadCollection_31`] = function loadCollection_31() { return this.load('collection-31') || []; };

Storage[`loadCollection_32`] = function loadCollection_32() { return this.load('collection-32') || []; };

Storage[`loadCollection_33`] = function loadCollection_33() { return this.load('collection-33') || []; };

Storage[`loadCollection_34`] = function loadCollection_34() { return this.load('collection-34') || []; };

Storage[`loadCollection_35`] = function loadCollection_35() { return this.load('collection-35') || []; };

Storage[`loadCollection_36`] = function loadCollection_36() { return this.load('collection-36') || []; };

Storage[`loadCollection_37`] = function loadCollection_37() { return this.load('collection-37') || []; };

Storage[`loadCollection_38`] = function loadCollection_38() { return this.load('collection-38') || []; };

Storage[`loadCollection_39`] = function loadCollection_39() { return this.load('collection-39') || []; };

Storage[`loadCollection_40`] = function loadCollection_40() { return this.load('collection-40') || []; };
