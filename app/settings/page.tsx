"use client"

import { useState } from "react"
import { Settings, Bell, Volume2, Moon, Sun, Smartphone, Globe } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import { useTheme } from "@/lib/theme-context"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)
  const [mobileNotifications, setMobileNotifications] = useState(true)
  const [language, setLanguage] = useState("english")
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          <Settings className="mr-2" /> Settings
        </h1>
      </div>

      <div className="space-y-6">
        <PixelPanel>
          <h2 className="text-xl font-pixelFont mb-4 text-pixel-light">Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 border-b border-pixel-light">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-pixel-blue mr-3" />
                <div>
                  <h3 className="font-pixelFont text-pixel-light">Notifications</h3>
                  <p className="text-xs text-pixel-light opacity-80">Enable in-app notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className={`
                  w-11 h-6 
                  peer-focus:outline-none 
                  rounded-full peer 
                  border-2 
                  transition-all
                  ${theme === 'dark' 
                    ? 'bg-pixel-dark border-pixel-light' 
                    : 'bg-gray-200 border-gray-300'
                  }
                  peer-checked:after:translate-x-full 
                  peer-checked:after:border-white 
                  after:content-[''] 
                  after:absolute 
                  after:top-[2px] 
                  after:left-[2px] 
                  after:bg-pixel-light 
                  after:border-pixel-light 
                  after:border 
                  after:rounded-full 
                  after:h-5 
                  after:w-5 
                  after:transition-all 
                  peer-checked:bg-pixel-purple
                `}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2 border-b border-pixel-light">
              <div className="flex items-center">
                <Volume2 className="w-5 h-5 text-pixel-green mr-3" />
                <div>
                  <h3 className="font-pixelFont text-pixel-light">Sound Effects</h3>
                  <p className="text-xs text-pixel-light opacity-80">Enable game sounds and effects</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={sound} onChange={() => setSound(!sound)} />
                <div className={`
                  w-11 h-6 
                  peer-focus:outline-none 
                  rounded-full peer 
                  border-2 
                  transition-all
                  ${theme === 'dark' 
                    ? 'bg-pixel-dark border-pixel-light' 
                    : 'bg-gray-200 border-gray-300'
                  }
                  peer-checked:after:translate-x-full 
                  peer-checked:after:border-white 
                  after:content-[''] 
                  after:absolute 
                  after:top-[2px] 
                  after:left-[2px] 
                  after:bg-pixel-light 
                  after:border-pixel-light 
                  after:border 
                  after:rounded-full 
                  after:h-5 
                  after:w-5 
                  after:transition-all 
                  peer-checked:bg-pixel-green
                `}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2 border-b border-pixel-light">
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-pixel-purple mr-3" />
                ) : (
                  <Sun className="w-5 h-5 text-pixel-yellow mr-3" />
                )}
                <div>
                  <h3 className="font-pixelFont text-pixel-light">Dark Mode</h3>
                  <p className="text-xs text-pixel-light opacity-80">Toggle between light and dark theme</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <div className={`
                  w-11 h-6 
                  peer-focus:outline-none 
                  rounded-full peer 
                  border-2 
                  transition-all
                  ${theme === 'dark' 
                    ? 'bg-pixel-dark border-pixel-light' 
                    : 'bg-gray-200 border-gray-300'
                  }
                  peer-checked:after:translate-x-full 
                  peer-checked:after:border-white 
                  after:content-[''] 
                  after:absolute 
                  after:top-[2px] 
                  after:left-[2px] 
                  after:bg-pixel-light 
                  after:border-pixel-light 
                  after:border 
                  after:rounded-full 
                  after:h-5 
                  after:w-5 
                  after:transition-all 
                  peer-checked:bg-pixel-purple
                `}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2 border-b border-pixel-light">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-pixel-orange mr-3" />
                <div>
                  <h3 className="font-pixelFont text-pixel-light">Mobile Notifications</h3>
                  <p className="text-xs text-pixel-light opacity-80">Receive notifications on your mobile device</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={mobileNotifications}
                  onChange={() => setMobileNotifications(!mobileNotifications)}
                />
                <div className={`
                  w-11 h-6 
                  peer-focus:outline-none 
                  rounded-full peer 
                  border-2 
                  transition-all
                  ${theme === 'dark' 
                    ? 'bg-pixel-dark border-pixel-light' 
                    : 'bg-gray-200 border-gray-300'
                  }
                  peer-checked:after:translate-x-full 
                  peer-checked:after:border-white 
                  after:content-[''] 
                  after:absolute 
                  after:top-[2px] 
                  after:left-[2px] 
                  after:bg-pixel-light 
                  after:border-pixel-light 
                  after:border 
                  after:rounded-full 
                  after:h-5 
                  after:w-5 
                  after:transition-all 
                  peer-checked:bg-pixel-orange
                `}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-pixel-red mr-3" />
                <div>
                  <h3 className="font-pixelFont text-pixel-light">Language</h3>
                  <p className="text-xs text-pixel-light opacity-80">Select your preferred language</p>
                </div>
              </div>
              <select
                className={`
                  px-3 py-1
                  rounded-md
                  font-pixelFont
                  border-2
                  focus:outline-none
                  focus:border-pixel-blue
                  transition-colors
                  ${theme === 'dark' 
                    ? 'bg-pixel-dark border-pixel-light text-pixel-light' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
              </select>
            </div>
          </div>
        </PixelPanel>

        <PixelPanel>
          <h2 className="text-xl font-pixelFont mb-4 text-pixel-light">Account</h2>

          <div className="space-y-4">
            <div className="p-2 border-b border-pixel-light">
              <h3 className="font-pixelFont text-pixel-light">Email</h3>
              <p className="text-sm text-pixel-light opacity-80">user@example.com</p>
            </div>

            <div className="p-2 border-b border-pixel-light">
              <h3 className="font-pixelFont text-pixel-light">Password</h3>
              <p className="text-sm text-pixel-light opacity-80">Last changed 30 days ago</p>
              <div className="mt-2">
                <PixelButton size="small">Change Password</PixelButton>
              </div>
            </div>

            <div className="p-2">
              <h3 className="font-pixelFont text-pixel-light">Connected Devices</h3>
              <p className="text-sm text-pixel-light opacity-80">Manage devices connected to your account</p>
              <div className="mt-2">
                <PixelButton size="small">Manage Devices</PixelButton>
              </div>
            </div>
          </div>
        </PixelPanel>

        <PixelPanel>
          <h2 className="text-xl font-pixelFont mb-4 text-pixel-light">Data & Privacy</h2>

          <div className="space-y-4">
            <div className="p-2 border-b border-pixel-light">
              <h3 className="font-pixelFont text-pixel-light">Export Data</h3>
              <p className="text-sm text-pixel-light opacity-80">Download all your fitness data</p>
              <div className="mt-2">
                <PixelButton size="small">Export</PixelButton>
              </div>
            </div>

            <div className="p-2">
              <h3 className="font-pixelFont text-pixel-light text-pixel-red">Delete Account</h3>
              <p className="text-sm text-pixel-light opacity-80">Permanently delete your account and all data</p>
              <div className="mt-2">
                <PixelButton size="small" color="red">
                  Delete Account
                </PixelButton>
              </div>
            </div>
          </div>
        </PixelPanel>

        <div className="flex justify-center mt-6">
          <PixelButton>Save Settings</PixelButton>
        </div>
      </div>
    </div>
  )
}

