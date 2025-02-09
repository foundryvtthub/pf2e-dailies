import { getFlag, setFlag } from '@utils/foundry/flags'
import { sluggify } from '@utils/pf2e/utils'
import { MODULE_ID } from '@utils/module'
import { getCategoryUUIDS, isRuleItem } from './categories'
import { findItemWithSourceId } from '@utils/foundry/item'
import { WEAPON_TRAITS } from './data/weapon'

export function wrapRestForTheNight() {
    const original = game.pf2e.actions.restForTheNight
    game.pf2e.actions.restForTheNight = async (options: ActionDefaultOptions) => {
        const result = await original(options)
        if (result.length && options.actors) afterRest(options.actors)
        return result
    }
}

async function afterRest(actors: ActorPF2e | ActorPF2e[]) {
    actors = Array.isArray(actors) ? actors : [actors]

    const characters = actors.filter(x => x.isOfType('character')) as CharacterPF2e[]
    for (const actor of characters) {
        const update: EmbeddedDocumentUpdateData<ItemPF2e>[] = []
        const remove: string[] = []
        const itemTypes = actor.itemTypes

        const cleanRuleItem = (item: ItemPF2e) => {
            const rules = deepClone(item._source.system.rules)

            let modified = false
            for (let i = rules.length - 1; i >= 0; i--) {
                if (!(MODULE_ID in rules[i])) continue
                rules.splice(i, 1)
                modified = true
            }

            if (modified) update.push({ _id: item.id, 'system.rules': rules })
        }

        for (const item of itemTypes.feat) {
            if (isRuleItem(item)) cleanRuleItem(item)

            if (getFlag(item, 'temporary')) {
                const parentId = item.getFlag<string>('pf2e', 'grantedBy.id')
                if (parentId) {
                    const slug = sluggify(item.name, { camel: 'dromedary' })
                    const path = `flags.pf2e.itemGrants.-=${slug}`
                    update.push({ _id: parentId, [path]: true })
                }
                remove.push(item.id)
            }
        }

        for (const item of itemTypes.lore) {
            if (getFlag(item, 'temporary')) remove.push(item.id)
        }

        for (const item of itemTypes.equipment) {
            if (isRuleItem(item)) cleanRuleItem(item)
        }

        for (const item of itemTypes.heritage) {
            if (isRuleItem(item)) cleanRuleItem(item)
        }

        for (const item of itemTypes.spellcastingEntry) {
            if (getFlag(item, 'temporary')) remove.push(item.id)
        }

        const mindWeaponUUID = getCategoryUUIDS('mindsmith')[1]
        const mindWeapon = findItemWithSourceId(actor, mindWeaponUUID, ['weapon'])
        if (mindWeapon) {
            let traits = mindWeapon._source.system.traits?.value ?? []
            traits = traits.filter(x => !WEAPON_TRAITS.includes(x as MindSmithWeaponTrait))
            update.push({ _id: mindWeapon.id, 'system.traits.value': traits })

            const runeProperty = getFlag<RunePropertyKey | ''>(actor, 'weapon.runeProperty')
            if (runeProperty) {
                update.push({ _id: mindWeapon.id, [`system.${runeProperty}.value`]: null })
            }
        }

        setFlag(actor, 'weapon.runeProperty', '')
        if (update.length) actor.updateEmbeddedDocuments('Item', update)
        if (remove.length) actor.deleteEmbeddedDocuments('Item', remove)
    }
}
