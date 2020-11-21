import DSA5_Utility from "../system/utility-dsa5.js";
import DSA from "../system/config-dsa5.js"

export default class Itemdsa5 extends Item {
    static async create(data, options) {
        if (!data.img) {
            switch (data.type) {

                case "ammunition":
                    data.img = "icons/containers/ammunition/arrows-quiver-simple-brown.webp";
                    break;
                case "meleeweapon":
                    data.img = "icons/weapons/swords/greatsword-blue.webp";
                    break;
                case "rangeweapon":
                    data.img = "icons/weapons/bows/longbow-recurve-leather-brown.webp";
                    break;
                case "armor":
                    data.img = "icons/equipment/chest/breastplate-layered-leather-brown-silver.webp";
                    break;
                case "equipment":
                    data.img = "icons/containers/bags/sack-simple-leather-brown.webp";
                    break;
                case "career":
                    data.img = "icons/environment/people/commoner.webp";
                    break;
                case "disadvantage":
                    data.img = "icons/commodities/bones/skull-hollow-white.webp";
                    break
                case "advantage":
                    data.img = "icons/commodities/materials/hair-tuft-brown.webp";
                    break;


                default:
                    data.img = "systems/dsa5/icons/blank.webp";
            }
        }

        super.create(data, options);
    }

    prepareData() {
        super.prepareData();


    }


    prepareCareer(itemdata) {
        let skills = itemdata.items.filter(x => x.type == "skill").sort((a, b) => (a.sort || 0) - (b.sort || 0))

        return {
            skills: skills
        }
    }

    prepare() {
        let data = duplicate(this.data)

        switch (this.data.type) {

            case "career":
                mergeObject(preparedData, this.prepareCareer(preparedData));

        }
        preparedData.img = preparedData.img || DEFAULT_TOKEN;


        return preparedData;
    }

    _armorChatData() {
        const data = duplicate(this.data.data);
        var properties = [
            this._chatLineHelper("protection", data.protection.value),
            this._chatLineHelper("encumbrance", data.encumbrance.value)

        ]
        if (data.effect.value != "") {
            properties.push(this._chatLineHelper("effect", data.effect.value))
        }
        return properties;
    }

    _rangeweaponChatData() {
        const data = duplicate(this.data.data);
        let properties = [
            this._chatLineHelper("damage", data.damage.value),
            this._chatLineHelper("combatskill", data.combatskill.value)
        ]
        return properties;
    }

    _meleeweaponChatData() {
        const data = duplicate(this.data.data);
        let properties = [
            this._chatLineHelper("damage", data.damage.value),
            this._chatLineHelper("atmod", data.atmod.value),
            this._chatLineHelper("pamod", data.pamod.value),
            this._chatLineHelper("combatskill", data.combatskill.value)
        ]
        return properties;
    }

    _ammunitionChatData() {
        const data = duplicate(this.data.data);
        let properties = [
            this._chatLineHelper("ammunitiongroup", game.i18n.localize(data.ammunitiongroup.value))
        ]
        return properties;
    }

    _equipmentChatData() {
        const data = duplicate(this.data.data);
        let properties = [
            this._chatLineHelper("equipmentType", game.i18n.localize(data.equipmentType.value))
        ]
        return properties;
    }

    _chatLineHelper(key, val) {
        return `<b>${game.i18n.localize(key)}</b>: ${val}`
    }

    async postItem() {
        const properties = this[`_${this.data.type}ChatData`]();
        let chatData = duplicate(this.data);
        chatData["properties"] = properties

        //Check if the posted item should have availability/pay buttons
        chatData.hasPrice = "price" in chatData.data;
        console.log(chatData.hasPrice);
        if (chatData.hasPrice) {
            let price = chatData.data.price.value;
            chatData.data.price.D = Math.floor(price / 10);
            price -= chatData.data.price.D * 10;
            chatData.data.price.S = Math.floor(price);
            price -= chatData.data.price.S;
            chatData.data.price.H = Math.floor(price / 0.1);
            price -= (chatData.data.price.H * 0.1);
            chatData.data.price.K = Math.round(price / 0.01);

            properties.push(`<b>${game.i18n.localize("price")}</b>: ${chatData.data.price.D} <div title="${game.i18n.localize("Money-D")}" class="chatmoney money-D"></div>, ${chatData.data.price.S} <div title="${game.i18n.localize("Money-S")}" class="chatmoney money-S"></div>, ${chatData.data.price.H} <div title="${game.i18n.localize("Money-H")}" class="chatmoney money-H"></div>, ${chatData.data.price.K} <div title="${game.i18n.localize("Money-K")}" class="chatmoney money-K"></div>`);
        }



        // Don't post any image for the item (which would leave a large gap) if the default image is used
        if (chatData.img.includes("/blank.webp"))
            chatData.img = null;

        renderTemplate('systems/dsa5/templates/chat/post-item.html', chatData).then(html => {
            let chatOptions = DSA5_Utility.chatDataSetup(html)

            // Setup drag and drop data
            chatOptions["flags.transfer"] = JSON.stringify({
                type: "postedItem",
                payload: this.data,
            })
            chatOptions["flags.recreationData"] = chatData;
            ChatMessage.create(chatOptions)
        });
    }

}

CONFIG.Item.entityClass = Itemdsa5;