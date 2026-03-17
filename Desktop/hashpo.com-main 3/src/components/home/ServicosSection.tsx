import Link from "next/link";
import { Package, Shirt, ArrowRight } from "lucide-react";

const items = [
  { href: "/dropshipping", icon: Package, title: "Dropshipping", desc: "Conecte-se a fornecedores e venda no mini site sem estoque." },
  { href: "/impressao-sob-demanda", icon: Shirt, title: "Impressão sob demanda", desc: "Sua marca em camisetas e produtos. Venda no mini site." },
];

const ServicosSection = () => (
  <section className="py-16 px-6 bg-primary/5">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Serviços</h2>
      <p className="text-center text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
        Dropshipping com fornecedores ou impressão sob demanda para vender sua marca no seu mini site.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
      <p className="text-center mt-4">
        <Link href="/servicos" className="text-sm font-medium text-primary hover:underline">
          Ver todos os serviços →
        </Link>
      </p>
    </div>
  </section>
);

export default ServicosSection;
