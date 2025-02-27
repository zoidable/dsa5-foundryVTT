import DSA5StatusEffects from "../status/status_effects.js";
import DSA5ChatAutoCompletion from "../system/chat_autocompletion.js";
import DSA5 from "../system/config-dsa5.js";
import { tinyNotification } from "../system/view_helper.js";
import { bindImgToCanvasDragStart } from "./imgTileDrop.js";

export default function() {
    Hooks.on("renderJournalSheet", (obj, html, data) => {
        html.find(".close").attr("data-tooltip", game.i18n.localize("SHEET.Close"));
        html.find(".entry-image").attr("data-tooltip", game.i18n.localize("SHEET.imageView"));
        html.find(".entry-text").attr("data-tooltip", game.i18n.localize("SHEET.textView"));
        html.find(".share-image").attr("data-tooltip", game.i18n.localize("SHEET.showToPlayers"));
        html.find(".import").attr("data-tooltip", game.i18n.localize("SHEET.import"));
        html.find(".panMapNote").attr("data-tooltip", game.i18n.localize("SHEET.panMapNote"));
        html.find(".increaseFontSize").attr("data-tooltip", game.i18n.localize("SHEET.increaseFontSize"));
    })

    Hooks.on("renderJournalPageSheet", (obj, html, data) => {
        DSA5ChatAutoCompletion.bindRollCommands(html)
        DSA5StatusEffects.bindButtons(html)
        html.find('img').mousedown(ev => { if (ev.button == 2) game.dsa5.apps.DSA5_Utility.showArtwork({ name: obj.name, uuid: "", img: $(ev.currentTarget).attr("src") }) })
        bindImgToCanvasDragStart(html)
    })  

    Hooks.on("getJournalSheetHeaderButtons", (sheet, buttons) => {
        buttons.unshift({
            class: "increaseFontSize",
            icon: "fas fa-arrows-up-down",
            onclick: async() => increaseFontSize($(sheet._element).find('.journal-page-content'))
        })

        if (!sheet.document.sceneNote) return

        buttons.unshift({
            class: "panMapNote",
            icon: "fas fa-map-pin",
            onclick: async() => sheet.document.panToNote()
        })
    })
}

export async function increaseFontSize(element){
    const index = game.settings.get("dsa5", "journalFontSizeIndex")
    let newIndex = index + 1
    if(newIndex == DSA5.journalFontSizes.length + 1) {
        newIndex = 0
        await game.settings.set("dsa5", "journalFontSizeIndex", newIndex)
        element.css("fontSize", "")
        tinyNotification(game.i18n.format('CHATNOTIFICATION.fontsize', { size: "Default " }))
    } else {
        await game.settings.set("dsa5", "journalFontSizeIndex", newIndex)
        setOuterFontSize(element)
    }  
}

function setOuterFontSize(element){
    const index = game.settings.get("dsa5", "journalFontSizeIndex")
    const size = DSA5.journalFontSizes[index - 1] || 14;
    tinyNotification(game.i18n.format('CHATNOTIFICATION.fontsize', { size }))
    element.css("fontSize", `${size}px`)
}