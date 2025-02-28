"use client"

import { useState } from "react"
import { Package, ShoppingBag, Star, Zap, Shield, Crown, Sparkles, Search, Dumbbell, Brain, Flame } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelItem from "@/components/pixel-item"

type ItemType = "badge" | "powerup" | "avatar" | "background"

interface InventoryItem {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: any
  equipped?: boolean
}

interface ShopItem extends InventoryItem {
  price: number
  owned: boolean
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<"inventory" | "shop">("shop") // Changed default to "shop"
  const [activeCategory, setActiveCategory] = useState<ItemType>("badge")
  const [searchQuery, setSearchQuery] = useState("")
  const [currency, setCurrency] = useState(1500)

  // Rest of the component remains the same
  const inventory: Record<ItemType, InventoryItem[]> = {
    badge: [
      {
        id: "b1",
        name: "Early Bird",
        description: "Complete 10 morning workouts",
        type: "badge",
        rarity: "common",
        icon: Star,
        equipped: true,
      },
      {
        id: "b2",
        name: "Strength Master",
        description: "Achieve perfect form in strength training",
        type: "badge",
        rarity: "rare",
        icon: Dumbbell,
        equipped: false,
      },
      {
        id: "b3",
        name: "Quest Champion",
        description: "Complete 100 quests",
        type: "badge",
        rarity: "epic",
        icon: Crown,
        equipped: true,
      },
    ],
    powerup: [
      {
        id: "p1",
        name: "2x XP Boost",
        description: "Double XP for 2 hours",
        type: "powerup",
        rarity: "rare",
        icon: Zap,
      },
      {
        id: "p2",
        name: "Perfect Form",
        description: "Enhanced form detection for 1 hour",
        type: "powerup",
        rarity: "epic",
        icon: Sparkles,
      },
    ],
    avatar: [
      {
        id: "a1",
        name: "Warrior Avatar",
        description: "A mighty warrior's appearance",
        type: "avatar",
        rarity: "rare",
        icon: Shield,
        equipped: true,
      },
    ],
    background: [
      {
        id: "bg1",
        name: "Pixel Gym",
        description: "Classic gym background",
        type: "background",
        rarity: "common",
        icon: Dumbbell,
        equipped: true,
      },
    ],
  }

  const shopItems: Record<ItemType, ShopItem[]> = {
    badge: [
      {
        id: "sb1",
        name: "Dragon Warrior",
        description: "Complete the legendary workout challenge",
        type: "badge",
        rarity: "legendary",
        icon: Crown,
        price: 1000,
        owned: false,
      },
      {
        id: "sb2",
        name: "Speed Demon",
        description: "Master high-intensity workouts",
        type: "badge",
        rarity: "epic",
        icon: Flame,
        price: 750,
        owned: false,
      },
    ],
    powerup: [
      {
        id: "sp1",
        name: "Week of 2x XP",
        description: "Double XP for an entire week",
        type: "powerup",
        rarity: "legendary",
        icon: Star,
        price: 2000,
        owned: false,
      },
      {
        id: "sp2",
        name: "Perfect Form Boost",
        description: "Enhanced form detection for 3 days",
        type: "powerup",
        rarity: "epic",
        icon: Shield,
        price: 1000,
        owned: false,
      },
    ],
    avatar: [
      {
        id: "sa1",
        name: "Mystic Trainer",
        description: "Legendary trainer appearance",
        type: "avatar",
        rarity: "legendary",
        icon: Brain,
        price: 3000,
        owned: false,
      },
    ],
    background: [
      {
        id: "sbg1",
        name: "Neon Dojo",
        description: "Cyberpunk training environment",
        type: "background",
        rarity: "epic",
        icon: Sparkles,
        price: 1500,
        owned: false,
      },
    ],
  }

  const handlePurchase = (item: ShopItem) => {
    if (currency >= item.price) {
      setCurrency(currency - item.price)
      // Add item to inventory
      alert(`Purchased ${item.name}!`)
    } else {
      alert("Not enough currency!")
    }
  }

  const filteredItems = (activeTab === "inventory" ? inventory : shopItems)[activeCategory].filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderItemDescription = (item: ShopItem) => (
    <>
      <span className="block">{item.description}</span>
      <span className="mt-1 flex items-center">
        <Star className="w-4 h-4 text-pixel-yellow mr-1" />
        <span className="text-pixel-yellow">{item.price}</span>
      </span>
    </>
  )

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          {activeTab === "inventory" ? <Package className="mr-2" /> : <ShoppingBag className="mr-2" />}
          {activeTab === "inventory" ? "Collection" : "Shop"} {/* Changed "Inventory" to "Collection" */}
        </h1>

        <div className="flex items-center gap-4">
          <div className="bg-pixel-dark border-2 border-pixel-light rounded-md px-4 py-2 flex items-center">
            <Star className="w-5 h-5 text-pixel-yellow mr-2" />
            <span className="font-pixelFont text-pixel-light">{currency}</span>
          </div>

          <div className="flex">
            <button
              className={`px-4 py-2 font-pixelFont border-t-2 border-l-2 border-b-2 border-pixel-light rounded-l-md ${
                activeTab === "inventory" ? "bg-pixel-blue text-pixel-light" : "bg-pixel-dark text-pixel-light"
              }`}
              onClick={() => setActiveTab("inventory")}
            >
              Collection {/* Changed "Inventory" to "Collection" */}
            </button>
            <button
              className={`px-4 py-2 font-pixelFont border-2 border-pixel-light rounded-r-md ${
                activeTab === "shop" ? "bg-pixel-orange text-pixel-light" : "bg-pixel-dark text-pixel-light"
              }`}
              onClick={() => setActiveTab("shop")}
            >
              Shop
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <PixelPanel>
            <h2 className="text-xl font-pixelFont text-pixel-light mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                className={`w-full px-4 py-2 rounded-md font-pixelFont text-left flex items-center ${
                  activeCategory === "badge"
                    ? "bg-pixel-blue text-pixel-light"
                    : "bg-pixel-dark text-pixel-light hover:bg-pixel-blue/20"
                }`}
                onClick={() => setActiveCategory("badge")}
              >
                <Crown className="w-5 h-5 mr-2" /> Badges
              </button>
              <button
                className={`w-full px-4 py-2 rounded-md font-pixelFont text-left flex items-center ${
                  activeCategory === "powerup"
                    ? "bg-pixel-blue text-pixel-light"
                    : "bg-pixel-dark text-pixel-light hover:bg-pixel-blue/20"
                }`}
                onClick={() => setActiveCategory("powerup")}
              >
                <Zap className="w-5 h-5 mr-2" /> Power-ups
              </button>
              <button
                className={`w-full px-4 py-2 rounded-md font-pixelFont text-left flex items-center ${
                  activeCategory === "avatar"
                    ? "bg-pixel-blue text-pixel-light"
                    : "bg-pixel-dark text-pixel-light hover:bg-pixel-blue/20"
                }`}
                onClick={() => setActiveCategory("avatar")}
              >
                <Shield className="w-5 h-5 mr-2" /> Avatars
              </button>
              <button
                className={`w-full px-4 py-2 rounded-md font-pixelFont text-left flex items-center ${
                  activeCategory === "background"
                    ? "bg-pixel-blue text-pixel-light"
                    : "bg-pixel-dark text-pixel-light hover:bg-pixel-blue/20"
                }`}
                onClick={() => setActiveCategory("background")}
              >
                <Sparkles className="w-5 h-5 mr-2" /> Backgrounds
              </button>
            </div>
          </PixelPanel>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          <PixelPanel>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-pixelFont text-pixel-light capitalize">{activeCategory}s</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pixel-light opacity-50" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-pixel-dark border-2 border-pixel-light rounded-md text-sm font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id}>
                  {"price" in item ? (
                    <PixelItem
                      {...item}
                      onClick={() => handlePurchase(item)}
                      disabled={item.owned || currency < item.price}
                      description={renderItemDescription(item)}
                    />
                  ) : (
                    <PixelItem {...item} onClick={() => alert(`${item.name} selected!`)} />
                  )}
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <p className="font-pixelFont text-pixel-light text-lg mb-2">No items found!</p>
                  <p className="text-pixel-light opacity-80">Try a different search or category.</p>
                </div>
              )}
            </div>
          </PixelPanel>
        </div>
      </div>
    </div>
  )
}

