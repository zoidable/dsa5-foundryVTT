export default class TraitRulesDSA5 {
  static async traitAdded(actor, item) {
     switch (item.name) {
      case "Vertrauter":

        await actor.update({
          "data.status.wounds.initial": Number(actor.data.data.status.wounds.initial) + 10,
          "data.status.soulpower.value": Number(actor.data.data.status.soulpower.value) + 1,
          "data.status.toughness.value": Number(actor.data.data.status.toughness.value) + 1,
          "data.status.astralenergy.initial": Number(actor.data.data.status.astralenergy.initial) + 15,
        });
        let armor = actor.items.find(x => x.type == "trait" && x.name == "Natürliche Rüstung")
        if (armor) {
          armor = duplicate(armor)
          armor.data.at.value = Number(armor.data.at.value) + 1
          actor.updateEmbeddedEntity("OwnedItem", armor)
        } else {
          //generate armor
        }
        break
    }
  }


  static async traitRemoved(actor, item) {
    switch (item.name) {
      case "Vertrauter":

        await actor.update({
          "data.status.wounds.initial": Number(actor.data.data.status.wounds.initial) - 10,
          "data.status.soulpower.value": Number(actor.data.data.status.soulpower.value) - 1,
          "data.status.toughness.value": Number(actor.data.data.status.toughness.value) - 1,
          "data.status.astralenergy.initial": Number(actor.data.data.status.astralenergy.initial) - 15,
        });
        let armor = actor.items.find(x => x.type == "trait" && x.name == "Natürliche Rüstung")
        if (armor) {
          armor = duplicate(armor)
          armor.data.at.value = Number(armor.data.at.value) - 1
          actor.updateEmbeddedEntity("OwnedItem", armor)
        }
        break
    }
  }
}