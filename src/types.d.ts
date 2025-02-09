declare const game: GamePF2e
declare const canvas: CanvasPF2e
declare const ui: UiPF2e

/**
 * Variables
 */

type RunePropertyKey = 'propertyRune1' | 'propertyRune2' | 'propertyRune3' | 'propertyRune4'

type MindSmithDamageType = keyof typeof import('@data/weapon').WEAPON_GROUPS
type MindSmithWeaponTrait = typeof import('@data/weapon').WEAPON_TRAITS[number]
type MindSmithWeaponRunes = typeof import('@data/weapon').WEAPON_RUNES[number]
type MindSmithWeaponGreaterRunes = typeof import('@data/weapon').WEAPON_GREATER_RUNES[number]
type MindSmithWeaponAllRunes = MindSmithWeaponRunes | MindSmithWeaponGreaterRunes
type MindSmithSavedObject = {
    damage: MindSmithDamageType
    trait: MindSmithWeaponTrait
    rune: MindSmithWeaponAllRunes
}
type MindSmithSavedItem<K extends keyof MindSmithSavedObject> = RequiredBy<
    SelectTemplate<MindSmithSavedObject[K], K>,
    'label' | 'subcategory'
>

type TrainedSkill = ExtractedCategory<'trainedSkill'>
type ThaumaturgeTome = ExtractedCategory<'thaumaturgeTome'>
type TrainedLore = ExtractedCategory<'trainedLore'>
type AddedLanguage = ExtractedCategory<'addedLanguage'>
type AddedResistance = ExtractedCategory<'addedResistance'>
type ScrollChain = ExtractedCategory<'scrollChain'>
type CombatFlexibility = ExtractedCategory<'combatFlexibility'>
type ScrollSavant = ExtractedCategory<'scrollSavant'>
type TricksterAce = ExtractedCategory<'tricksterAce'>
type GanziHeritage = ExtractedCategory<'ganziHeritage'>
type MindSmith = ExtractedCategory<'mindSmith'>

type SavedCategories = Partial<
    BaseSavedCategory<TrainedSkill, SavedCombo> &
        BaseSavedCategory<ThaumaturgeTome, SavedCombo[]> &
        BaseSavedCategory<TrainedLore, string> &
        BaseSavedCategory<AddedLanguage, Language> &
        BaseSavedCategory<AddedResistance, ResistanceType> &
        SavedItemsCategory<ScrollChain> &
        SavedItemsCategory<CombatFlexibility> &
        SavedItemsCategory<ScrollSavant> &
        BaseSavedCategory<TricksterAce, SavedItem> &
        BaseSavedCategory<MindSmith, Partial<MindSmithSavedObject>>
>

type TrainedSkillTemplate = BaseComboCategoryTemplate<TrainedSkill, SkillLongForm>
type ThaumaturgeTomeTemplate = BaseComboCategoryTemplate<ThaumaturgeTome, SkillLongForm>
type TrainedLoreTemplate = BaseCategoryTemplate<TrainedLore, InputTemplate[]>
type AddedLanguageTemplate = BaseSelectCategoryTemplate<AddedLanguage, Language>
type AddedResistanceTemplate = BaseSelectCategoryTemplate<AddedResistance, ResistanceType>
type ScrollChainTemplate = BaseDropCategoryTemplate<ScrollChain>
type CombatFlexibilityTemplate = BaseDropCategoryTemplate<CombatFlexibility>
type ScrollSavantTemplate = BaseDropCategoryTemplate<ScrollSavant>
type TricksterAceTemplate = BaseDropCategoryTemplate<TricksterAce>
type GanziHeritageTemplate = BaseRandomCategoryTemplate<GanziHeritage, ResistanceType>
type MindSmithTemplate = BaseCategoryTemplate<
    MindSmith,
    [AlertTemplate] | [MindSmithSavedItem<'damage'>, MindSmithSavedItem<'trait'>, MindSmithSavedItem<'rune'>]
>

type TemplateField =
    | ComboTemplateField<TrainedSkill>
    | ComboTemplateField<ThaumaturgeTome>
    | BaseTemplateField<TrainedLore, string>
    | BaseTemplateField<AddedLanguage, Language>
    | BaseTemplateField<AddedResistance, ResistanceType>
    | DropTemplateField<ScrollChain>
    | DropTemplateField<CombatFlexibility>
    | DropTemplateField<ScrollSavant>
    | DropTemplateField<TricksterAce>
    | RandomTemplateField<GanziHeritage, ResistanceType>
    | SelectTemplateField<MindSmith, string, keyof MindSmithSavedObject>

/**
 * End of Variables
 */

type SavedItem = { name: string; uuid: TemplateUUID }
type SavedCombo = { selected: string; input: boolean }

type TemplateUUID = ItemUUID | ''
type TemplateLevel = `${OneToTen}`

type FourElementTrait = Exclude<ElementalTrait, 'metal'>

type Category = typeof import('./categories').CATEGORIES[number]
type CategoryType = Category['type']
type CategoryName = Category['category']

type RulesName = typeof import('./categories').RULE_TYPES[number]

type ExtractedCategory<T extends string> = Extract<Category, { type: T }>

type BaseSavedCategory<C extends Category, D extends any> = Record<C['category'], D>

type SavedItemsCategory<C extends Category> = BaseSavedCategory<C, SavedItem[]>

type BaseCategoryTemplate<C extends Category = Category, R extends any = any> = {
    type: C['type']
    category: C['category']
    label: string
    rows: R
}

type BaseSelectCategoryTemplate<C extends Category, R extends any = any> = BaseCategoryTemplate<C, SelectTemplate<R, string>[]>

type BaseRandomCategoryTemplate<C extends Category, R extends any = any> = BaseCategoryTemplate<C, RandomTemplate<R>[]>

type BaseDropCategoryTemplate<C extends Category> = BaseCategoryTemplate<C, DropTemplate[]>

type BaseComboCategoryTemplate<C extends Category, R extends any = any> = BaseCategoryTemplate<C, ComboTemplate<R>[]>

type SelectTemplate<K extends string, S extends string> = {
    type: 'select'
    options: readonly K[]
    selected: K | ''
    subcategory?: S
    label?: string
}

type RandomTemplate<K extends string> = {
    type: 'random'
    options: readonly K[]
}

type AlertTemplate = {
    type: 'alert'
    message: string
}

type InputTemplate = {
    type: 'input'
    selected: string
    placeholder: string
}

type ComboTemplate<K extends string> = {
    type: 'combo'
    selected: K | string
    placeholder?: string
    options: readonly K[]
    label?: string
    rank?: OneToFour
    input: boolean
}

type DropTemplate = {
    type: 'drop'
    label?: string
    level: number
    name: string
    uuid: TemplateUUID
}

type BaseTemplateField<C extends Category = Category, V extends string = string> = Omit<HTMLElement, 'value' | 'dataset'> & {
    value: V
    dataset: {
        type: C['type']
        category: C['category']
    }
}

type SelectTemplateField<C extends Category, V extends string, S extends string> = Omit<
    HTMLSelectElement,
    'value' | 'dataset'
> & {
    value: V
    dataset: {
        type: C['type']
        category: C['category']
        subcategory: S
    }
}

type RandomTemplateField<C extends Category, V extends string> = Omit<HTMLSelectElement, 'value' | 'dataset'> & {
    value: V
    dataset: {
        type: C['type']
        category: C['category']
    }
}

type ComboTemplateField<C extends Category = Category> = Omit<HTMLInputElement, 'value' | 'dataset'> & {
    value: V
    dataset: {
        type: C['type']
        category: C['category']
        input: `${boolean}`
        rank: `${number}` | ''
    }
}

type DropTemplateField<C extends Category> = BaseTemplateField<C, string> & {
    dataset: {
        level: TemplateLevel
        uuid: ItemUUID
    }
}

type SearchTemplateButton = Omit<HTMLElement, 'dataset'> & { dataset: { type: CategoryType; level: TemplateLevel } }

type ReturnedCategoryItems = [ItemPF2e, ...(undefined | ItemPF2e)[]]
type ReturnedCategory<C extends Category = Category> = Omit<Required<C>, 'uuids' | 'label'> & {
    label: string
    items: ReturnedCategoryItems
}

type SelectedObject = { uuid: string; selected: string; update: EmbeddedDocumentUpdateData<ItemPF2e> }
