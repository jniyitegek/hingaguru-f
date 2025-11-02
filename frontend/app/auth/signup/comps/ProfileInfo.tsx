import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

const ProfileInfo = ( { setCurrentSection }: { setCurrentSection: (section: number) => void}) => {
    return ( 
        <div>
            <div className="space-y-[24px]">
                <div>
                    <Typography weight="medium" color="gray_900" className="mb-2">Phone number</Typography>
                    <label htmlFor="phone-number" className="flex gap-2 items-center border-[1.2] focus-within:border-primary-600 rounded-lg px-0.5">
                        <Input
                            id="country-code"
                            variant="select"
                            value={`+250`}
                            // onChange={(value) => setCurrencyBuy(value)}
                            options={[{ value: "+250", label: "+250" }, { value: "+256", label: "+256" }]}
                            className="min-w-[88px]"
                            border={false}
                        />
                        <Input
                            id="phone-number"
                            variant="text"
                            // value={buyNowPrice}
                            // onChange={setBuyNowPrice}
                            placeholder="Enter your number"
                            className="w-full"
                            border={false}
                        />
                    </label>
                </div>
                <Input
                    id="business"
                    label="Business"
                    variant="text"
                    placeholder="Enter your org name"
                />
                <Input
                    id="city"
                    label="City"
                    variant="text"
                    placeholder="Enter your city address"
                />
                <Input
                    id="street"
                    label="Street"
                    variant="text"
                    placeholder="Enter your street address"
                />
                <div className="flex justify-between ">
                    <Button className={`w-[45%]`} variant={`outline`} onClick={() => setCurrentSection(0)}>Back</Button>
                    <Button className={`w-[45%]`} onClick={() => setCurrentSection(2)}>Submit</Button>
                </div>
            </div>


        </div>
     );
}
 
export default ProfileInfo;