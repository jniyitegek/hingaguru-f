import { Bell, Search, Settings } from "lucide-react";
import Input from "@/components/ui/Input";
import { useLocale } from "@/context/LocaleContext";

const AuthNav = () => {
    const { locale, setLocale, t } = useLocale();

    return (
        <header className="flex items-center gap-4">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
                <Input
                    id="lang-select"
                    variant="select"
                    value={locale}
                    onChange={(v) => setLocale(v as "en" | "rw")}
                    options={[
                        { value: "en", label: "English" },
                        { value: "rw", label: "Kinyarwanda" },
                    ]}
                />
            </div>
        </header>
    );
};

export default AuthNav;