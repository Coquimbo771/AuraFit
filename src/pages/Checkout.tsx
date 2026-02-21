import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';
import { Button, Card, Input, PageTransition, Footer } from '../components';
import { useShoppingStore } from '../store/shoppingStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    cart,
    checkout,
    removeFromCart,
    updateCartItemQty,
    setCouponCode,
    setOrderNotes,
    setShippingAddress,
    createOrder,
  } = useShoppingStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: checkout.shippingAddress?.fullName || '',
    phone: checkout.shippingAddress?.phone || '',
    country: checkout.shippingAddress?.country || 'Peru',
    city: checkout.shippingAddress?.city || '',
    addressLine1: checkout.shippingAddress?.addressLine1 || '',
    addressLine2: checkout.shippingAddress?.addressLine2 || '',
    postalCode: checkout.shippingAddress?.postalCode || '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (cart.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', cart.map((item) => item.productId));

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading cart products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [cart]);

  const cartRows = useMemo(() => {
    const map = new Map(products.map((product) => [product.id, product]));
    return cart
      .map((item) => ({
        item,
        product: map.get(item.productId),
      }))
      .filter((row) => row.product);
  }, [cart, products]);

  const subtotal = useMemo(
    () => cartRows.reduce((sum, row) => sum + (row.product?.price || 0) * row.item.quantity, 0),
    [cartRows]
  );

  const discount = checkout.couponCode.trim().toUpperCase() === 'AURAFIT10' ? subtotal * 0.1 : 0;
  const shipping = subtotal > 180 ? 0 : 12;
  const taxes = subtotal * 0.18;
  const total = subtotal - discount + shipping + taxes;

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido.');
      navigate('/login');
      return;
    }

    // Validar campos obligatorios
    if (!addressForm.fullName || !addressForm.phone || !addressForm.city || !addressForm.addressLine1 || !addressForm.postalCode) {
      alert('Por favor, completa todos los campos obligatorios de envío (Nombre, Teléfono, Ciudad, Dirección y Código postal).');
      return;
    }

    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    setShippingAddress(addressForm);
    setPlacingOrder(true);

    try {
      const orderId = await createOrder(user.id);
      if (orderId) {
        alert(`¡Pedido creado exitosamente!\n\nID del pedido: ${orderId}\n\nSerás redirigido a tu dashboard.`);
        navigate('/dashboard');
      } else {
        alert('No se pudo crear el pedido. Por favor, intenta nuevamente.');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error?.message || 'Error desconocido';
      alert(`Error al crear el pedido:\n\n${errorMessage}\n\nPor favor, verifica tu conexión y vuelve a intentar.`);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Checkout</p>
            <h1 className="text-4xl font-bold text-ink">Finalizar compra</h1>
          </div>

          {cart.length === 0 ? (
            <Card variant="solid" className="p-10 text-center">
              <ShoppingCart className="mx-auto text-ink/40 mb-3" size={30} />
              <p className="text-ink/70 mb-6">Tu carrito está vacio.</p>
              <Button variant="primary" onClick={() => navigate('/marketplace')}>Ir a comprar</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8">
              <Card variant="solid" className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-ink">Productos</h2>

                {loadingProducts ? (
                  <p className="text-ink/60">Cargando productos...</p>
                ) : (
                  <div className="space-y-3">
                    {cartRows.map(({ item, product }) => (
                      <div key={item.productId} className="grid grid-cols-[70px_1fr_auto] gap-4 items-center border border-ink/10 rounded-2xl p-3">
                        <img
                          src={product?.image_url || 'https://via.placeholder.com/100x100?text=Item'}
                          alt={product?.name || 'Producto'}
                          className="w-[70px] h-[70px] rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-ink">{product?.name}</p>
                          <p className="text-sm text-ink/60">${Number(product?.price || 0).toFixed(2)}</p>
                          <div className="mt-2 inline-flex items-center gap-2 border border-ink/15 rounded-full px-2 py-1">
                            <button onClick={() => updateCartItemQty(item.productId, item.quantity - 1)}>
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold min-w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartItemQty(item.productId, item.quantity + 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-ink/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Coupon"
                    value={checkout.couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Ej: AURAFIT10"
                  />
                  <Input
                    label="Notas del pedido"
                    value={checkout.notes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Instrucciones de entrega"
                  />
                </div>
              </Card>

              <div className="space-y-6">
                <Card variant="solid" className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-ink">Envio</h3>
                  <Input label="Nombre completo" value={addressForm.fullName} onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))} />
                  <Input label="Telefono" value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Pais" value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} />
                    <Input label="Ciudad" value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <Input label="Direccion" value={addressForm.addressLine1} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine1: e.target.value }))} />
                  <Input label="Depto/Piso" value={addressForm.addressLine2} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine2: e.target.value }))} />
                  <Input label="Codigo postal" value={addressForm.postalCode} onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))} />
                </Card>

                <Card variant="glass" className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-ink">Resumen</h3>
                  <div className="flex items-center justify-between text-ink/70"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between text-ink/70"><span>Descuento</span><span>- ${discount.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between text-ink/70"><span>Envio</span><span>${shipping.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between text-ink/70"><span>Impuestos</span><span>${taxes.toFixed(2)}</span></div>
                  <div className="pt-3 border-t border-ink/10 flex items-center justify-between text-lg font-bold text-ink"><span>Total</span><span>${total.toFixed(2)}</span></div>

                  <Button variant="primary" className="w-full" onClick={handlePlaceOrder} isLoading={placingOrder}>
                    <CreditCard size={18} />
                    Confirmar pedido
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};
