// ==UserScript==
// @name        Zen Active Tabs Toggle
// @description Bouton dans la sidebar : n'afficher que les onglets chargés
// @include     main
// ==/UserScript==

(() => {
  const PREF = "zen.mod.active-tabs-only";
  const ATTR = "zen-active-only";
  const ID = "zen-active-tabs-toggle";
  const HOSTS = ["zen-sidebar-foot-buttons", "zen-sidebar-bottom-buttons", "zen-sidebar-top-buttons"];
  const root = document.documentElement;
  console.log("[active-tabs] script chargé");

  const apply = (on) => {
    root.toggleAttribute(ATTR, on);
    document.getElementById(ID)?.toggleAttribute("checked", on);
    try { Services.prefs.setBoolPref(PREF, on); } catch (e) {}
  };

  const mount = () => {
    if (document.getElementById(ID)) return true;
    const host = HOSTS.map((id) => document.getElementById(id)).find(Boolean);
    if (!host) return false;

    const btn = document.createXULElement("toolbarbutton");
    btn.id = ID;
    btn.className = "toolbarbutton-1 chromeclass-toolbar-additional";
    btn.setAttribute("tooltiptext", "Afficher uniquement les onglets actifs");
    btn.addEventListener("command", () => apply(!root.hasAttribute(ATTR)));
    host.prepend(btn);

    let saved = false;
    try { saved = Services.prefs.getBoolPref(PREF, false); } catch (e) {}
    apply(saved);
    console.log("[active-tabs] bouton ajouté dans #" + host.id);
    return true;
  };

  let tries = 0;
  const wait = setInterval(() => {
    if (mount()) clearInterval(wait);
    else if (++tries > 60) {
      clearInterval(wait);
      console.warn("[active-tabs] aucun conteneur trouvé :", HOSTS.join(", "));
    }
  }, 500);
})();
