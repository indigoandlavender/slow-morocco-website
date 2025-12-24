"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PricingCalculatorPage() {
  // Journey Details
  const [days, setDays] = useState(7);
  const [nights, setNights] = useState(6);
  const [transportDays, setTransportDays] = useState(6);

  // Guests
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Transportation
  const [vehicle, setVehicle] = useState("prado");
  const [luxury, setLuxury] = useState(0);

  // Accommodation
  const [singleRooms, setSingleRooms] = useState(0);
  const [doubleRooms, setDoubleRooms] = useState(1);
  const [twinRooms, setTwinRooms] = useState(0);
  const [tripleRooms, setTripleRooms] = useState(0);
  const [singleRate, setSingleRate] = useState(1500);
  const [doubleRate, setDoubleRate] = useState(2000);
  const [twinRate, setTwinRate] = useState(2000);
  const [tripleRate, setTripleRate] = useState(2600);
  const [cityTax, setCityTax] = useState(44);

  // Meals
  const [lunchAdult, setLunchAdult] = useState(150);
  const [lunchChild, setLunchChild] = useState(100);
  const [lunchDays, setLunchDays] = useState(4);
  const [dinnerAdult, setDinnerAdult] = useState(250);
  const [dinnerChild, setDinnerChild] = useState(150);
  const [dinnerDays, setDinnerDays] = useState(4);

  // Hospitality
  const [waterMeal, setWaterMeal] = useState(40);
  const [restaurantTip, setRestaurantTip] = useState(20);
  const [hotelTip, setHotelTip] = useState(20);
  const [carWater, setCarWater] = useState(10);
  const [snacks, setSnacks] = useState(20);
  const [teaCoffee, setTeaCoffee] = useState(20);
  const [kleenex, setKleenex] = useState(10);
  const [emergencyKit, setEmergencyKit] = useState(100);

  // Activities
  const [balloonToggle, setBalloonToggle] = useState(false);
  const [balloonPrice, setBalloonPrice] = useState(0);
  const [balloonPax, setBalloonPax] = useState(0);
  const [camelToggle, setCamelToggle] = useState(false);
  const [camelPrice, setCamelPrice] = useState(300);
  const [camelPax, setCamelPax] = useState(0);
  const [workshopToggle, setWorkshopToggle] = useState(false);
  const [workshopPrice, setWorkshopPrice] = useState(0);
  const [workshopPax, setWorkshopPax] = useState(0);

  // Historic Sites
  const [site1Price, setSite1Price] = useState(0);
  const [site2Price, setSite2Price] = useState(0);

  // Gifts
  const [wineToggle, setWineToggle] = useState(true);
  const [wineCost, setWineCost] = useState(400);
  const [giftLevel, setGiftLevel] = useState("none");

  // Totals
  const [totals, setTotals] = useState({
    transport: 0,
    accommodation: 0,
    cityTax: 0,
    meals: 0,
    hospitality: 0,
    activities: 0,
    historic: 0,
    gifts: 0,
    grand: 0,
  });

  // Calculate
  useEffect(() => {
    const guests = adults + children;
    const vehicleRate = vehicle === "prado" ? 1500 : 2200;
    
    const transportCost = (vehicleRate * transportDays) + luxury;
    const accomCost = (singleRooms * singleRate * nights) + (doubleRooms * doubleRate * nights) + (twinRooms * twinRate * nights) + (tripleRooms * tripleRate * nights);
    const cityTaxTotal = cityTax * guests * nights;
    const lunchTotal = (adults * lunchAdult + children * lunchChild) * lunchDays;
    const dinnerTotal = (adults * dinnerAdult + children * dinnerChild) * dinnerDays;
    const mealTotal = lunchTotal + dinnerTotal;
    const mealCount = lunchDays + dinnerDays;
    const hospitalityTotal = (waterMeal * guests * mealCount) + (restaurantTip * guests * mealCount) + (hotelTip * guests * nights) + (carWater * guests * transportDays) + (snacks * guests * transportDays) + (teaCoffee * guests * transportDays) + (kleenex * transportDays) + emergencyKit;
    
    let activitiesTotal = 0;
    if (balloonToggle) activitiesTotal += balloonPrice * balloonPax;
    if (camelToggle) activitiesTotal += camelPrice * camelPax;
    if (workshopToggle) activitiesTotal += workshopPrice * workshopPax;
    
    const historicTotal = (site1Price * guests) + (site2Price * guests);
    
    let giftsTotal = 0;
    if (wineToggle) giftsTotal += wineCost;
    const giftPerPerson = giftLevel === "level1" ? 150 : giftLevel === "level2" ? 300 : giftLevel === "level3" ? 600 : 0;
    giftsTotal += giftPerPerson * guests;

    const grand = transportCost + accomCost + cityTaxTotal + mealTotal + hospitalityTotal + activitiesTotal + historicTotal + giftsTotal;

    setTotals({
      transport: transportCost,
      accommodation: accomCost,
      cityTax: cityTaxTotal,
      meals: mealTotal,
      hospitality: hospitalityTotal,
      activities: activitiesTotal,
      historic: historicTotal,
      gifts: giftsTotal,
      grand,
    });
  }, [days, nights, transportDays, adults, children, vehicle, luxury, singleRooms, doubleRooms, twinRooms, tripleRooms, singleRate, doubleRate, twinRate, tripleRate, cityTax, lunchAdult, lunchChild, lunchDays, dinnerAdult, dinnerChild, dinnerDays, waterMeal, restaurantTip, hotelTip, carWater, snacks, teaCoffee, kleenex, emergencyKit, balloonToggle, balloonPrice, balloonPax, camelToggle, camelPrice, camelPax, workshopToggle, workshopPrice, workshopPax, site1Price, site2Price, wineToggle, wineCost, giftLevel]);

  // Styled input
  const Input = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div>
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-4 py-3 border border-border bg-background text-xl font-serif focus:outline-none focus:border-foreground"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/create" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </Link>
            <h1 className="font-serif text-3xl">Price Calculator</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left - Inputs */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Journey Details */}
            <section>
              <h2 className="font-serif text-xl mb-6">Journey Details</h2>
              <div className="grid grid-cols-3 gap-6">
                <Input label="Days" value={days} onChange={setDays} />
                <Input label="Nights" value={nights} onChange={setNights} />
                <Input label="Transport Days" value={transportDays} onChange={setTransportDays} />
              </div>
            </section>

            {/* Guests */}
            <section>
              <h2 className="font-serif text-xl mb-6">Guests</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Adults" value={adults} onChange={setAdults} />
                <Input label="Children (2-12)" value={children} onChange={setChildren} />
              </div>
            </section>

            {/* Transportation */}
            <section>
              <h2 className="font-serif text-xl mb-6">Transportation</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Vehicle</label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground"
                  >
                    <option value="prado">Toyota Prado (1-4)</option>
                    <option value="van">Van (5-6)</option>
                  </select>
                </div>
                <Input label="Luxury Add-on (dh)" value={luxury} onChange={setLuxury} />
              </div>
            </section>

            {/* Accommodation */}
            <section>
              <h2 className="font-serif text-xl mb-6">Accommodation</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Input label="Single" value={singleRooms} onChange={setSingleRooms} />
                <Input label="Double" value={doubleRooms} onChange={setDoubleRooms} />
                <Input label="Twin" value={twinRooms} onChange={setTwinRooms} />
                <Input label="Triple" value={tripleRooms} onChange={setTripleRooms} />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Input label="Single Rate" value={singleRate} onChange={setSingleRate} />
                <Input label="Double Rate" value={doubleRate} onChange={setDoubleRate} />
                <Input label="Twin Rate" value={twinRate} onChange={setTwinRate} />
                <Input label="Triple Rate" value={tripleRate} onChange={setTripleRate} />
              </div>
              <div className="max-w-xs">
                <Input label="City Tax / person / night" value={cityTax} onChange={setCityTax} />
              </div>
            </section>

            {/* Meals */}
            <section>
              <h2 className="font-serif text-xl mb-6">Meals</h2>
              <p className="text-sm text-muted-foreground mb-4">Lunch</p>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <Input label="Adult Price" value={lunchAdult} onChange={setLunchAdult} />
                <Input label="Child Price" value={lunchChild} onChange={setLunchChild} />
                <Input label="Days" value={lunchDays} onChange={setLunchDays} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Dinner</p>
              <div className="grid grid-cols-3 gap-6">
                <Input label="Adult Price" value={dinnerAdult} onChange={setDinnerAdult} />
                <Input label="Child Price" value={dinnerChild} onChange={setDinnerChild} />
                <Input label="Days" value={dinnerDays} onChange={setDinnerDays} />
              </div>
            </section>

            {/* Hospitality */}
            <section>
              <h2 className="font-serif text-xl mb-6">Hospitality</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Input label="Water/meal" value={waterMeal} onChange={setWaterMeal} />
                <Input label="Rest. tips" value={restaurantTip} onChange={setRestaurantTip} />
                <Input label="Hotel tips" value={hotelTip} onChange={setHotelTip} />
                <Input label="Car water" value={carWater} onChange={setCarWater} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Input label="Snacks" value={snacks} onChange={setSnacks} />
                <Input label="Tea/Coffee" value={teaCoffee} onChange={setTeaCoffee} />
                <Input label="Kleenex" value={kleenex} onChange={setKleenex} />
                <Input label="Emergency kit" value={emergencyKit} onChange={setEmergencyKit} />
              </div>
            </section>

            {/* Activities */}
            <section>
              <h2 className="font-serif text-xl mb-6">Activities</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={balloonToggle} onChange={(e) => setBalloonToggle(e.target.checked)} className="w-5 h-5" />
                  <span>Hot-Air Balloon</span>
                </label>
                {balloonToggle && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <Input label="Price (dh)" value={balloonPrice} onChange={setBalloonPrice} />
                    <Input label="Participants" value={balloonPax} onChange={setBalloonPax} />
                  </div>
                )}
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={camelToggle} onChange={(e) => setCamelToggle(e.target.checked)} className="w-5 h-5" />
                  <span>Camel Ride</span>
                </label>
                {camelToggle && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <Input label="Price/person" value={camelPrice} onChange={setCamelPrice} />
                    <Input label="Participants" value={camelPax} onChange={setCamelPax} />
                  </div>
                )}
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={workshopToggle} onChange={(e) => setWorkshopToggle(e.target.checked)} className="w-5 h-5" />
                  <span>Workshop</span>
                </label>
                {workshopToggle && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <Input label="Price/person" value={workshopPrice} onChange={setWorkshopPrice} />
                    <Input label="Participants" value={workshopPax} onChange={setWorkshopPax} />
                  </div>
                )}
              </div>
            </section>

            {/* Historic Sites */}
            <section>
              <h2 className="font-serif text-xl mb-6">Historic Sites</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Site #1 (per person)" value={site1Price} onChange={setSite1Price} />
                <Input label="Site #2 (per person)" value={site2Price} onChange={setSite2Price} />
              </div>
            </section>

            {/* Gifts */}
            <section>
              <h2 className="font-serif text-xl mb-6">Gifts</h2>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input type="checkbox" checked={wineToggle} onChange={(e) => setWineToggle(e.target.checked)} className="w-5 h-5" />
                <span>Welcome Wine (2 bottles)</span>
              </label>
              {wineToggle && (
                <div className="max-w-xs mb-6">
                  <Input label="Wine Cost" value={wineCost} onChange={setWineCost} />
                </div>
              )}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Gift Package</label>
                <select
                  value={giftLevel}
                  onChange={(e) => setGiftLevel(e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground"
                >
                  <option value="none">None</option>
                  <option value="level1">Level 1 (150 dh/person)</option>
                  <option value="level2">Level 2 (300 dh/person)</option>
                  <option value="level3">Level 3 (600 dh/person)</option>
                </select>
              </div>
            </section>

          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border border-border p-8">
              <h2 className="font-serif text-xl mb-6">Breakdown</h2>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Transport</span>
                  <span>{totals.transport.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Accommodation</span>
                  <span>{totals.accommodation.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">City Tax</span>
                  <span>{totals.cityTax.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Meals</span>
                  <span>{totals.meals.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Hospitality</span>
                  <span>{totals.hospitality.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Activities</span>
                  <span>{totals.activities.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Historic Sites</span>
                  <span>{totals.historic.toLocaleString()} dh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Gifts</span>
                  <span>{totals.gifts.toLocaleString()} dh</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-4xl">{totals.grand.toLocaleString()}</span>
                </div>
                <p className="text-right text-muted-foreground mt-1">dh</p>
                <p className="text-right text-sm text-muted-foreground mt-4">
                  ≈ ${Math.round(totals.grand / 10).toLocaleString()} USD
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
